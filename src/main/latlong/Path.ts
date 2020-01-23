import { LoggerFactory } from '@mmit/logging';
import * as validate from '@mmit/validate';
import { CatmullRomSpline2D, Point2D } from '../spline/CatmullRomSpline';
import { radianToDeg, round } from './convert';
import { Distance } from './Distance';
import { LatLng } from './LatLng';

/**
 * Necessary for creating new instances T extends LatLng (Path<T extends LatLng>)
 */
export type LatLangFactory = (latitude: number, longitude: number) => LatLng;

const defaultLatLngFactory: LatLangFactory = (latitude: number, longitude: number): LatLng => {
    return new LatLng(latitude, longitude);
};

export class Path<T extends LatLng> {
    private logger = LoggerFactory.getLogger('latlong.Path');

    /** For [Distance] calculations */
    private readonly _distance = Distance.useVincenty();

    private readonly latLngFactory = defaultLatLngFactory;

    /** Coordinates managed by this class */
    private readonly _coordinates: T[] = [];

    public static from<T extends LatLng>(coordinates: T[]): Path<T> {
        const path = new Path<T>();

        path._coordinates.push(...coordinates);

        return path;
    }

    public get coordinates(): readonly T[] {
        return this._coordinates;
    }

    public clear(): void {
        this._coordinates.length = 0;
    }

    public add(value: T): void {
        this._coordinates.push(value);
    }

    public addAll(values: readonly T[]): void {
        this._coordinates.push(...values);
    }

    public get first(): T {
        return this._coordinates[0];
    }

    public get last(): T {
        return this._coordinates[this._coordinates.length - 1];
    }

    /**
     * Splits the path into even sections.
     *
     * The section size is defined with [distanceInMeterPerTime].
     * [distanceInMeterPerTime] means that the original size on the given
     * path will stay the same but the created section could be smaller because of the "linear distance"
     *
     * However - if you follow the steps in a given time then the distance from point to point (over time)
     * is correct. (Almost - because of the curves generate with [CatmullRomSpline2D]
     *
     *     final Path path = new Path.from(zigzag);
     *
     * If [smoothPath] is turned on than the minimum of 3 coordinates is required otherwise
     * we need two
     */
    public equalize(
        distanceInMeterPerTime: number,
        { smoothPath = true }: { smoothPath?: boolean } = {},
    ): Path<LatLng> {
        validate.isTrue(
            distanceInMeterPerTime > 0,
            (): string => 'Distance must be greater than 0',
        );
        validate.isTrue(
            (smoothPath && this._coordinates.length >= 3) ||
                (!smoothPath && this._coordinates.length >= 2),
            (): string =>
                'At least ${smoothPath ? 3 : 2} coordinates are needed to create the steps in between',
        );

        // If we "smooth" the path every second step becomes a spline - so every other step
        // becomes a "Keyframe". A step on the given path
        const stepDistance = smoothPath ? distanceInMeterPerTime * 2.0 : distanceInMeterPerTime;

        const baseLength = this.distance;
        validate.isTrue(
            baseLength >= stepDistance,
            (): string =>
                `Path distance must be at least ${stepDistance}mn (step distance) but was ${baseLength}`,
        );

        if (stepDistance > baseLength / 2) {
            this.logger.warn(
                `Equalizing the path (L: ${baseLength}) with a key-frame ` +
                    ` distance of ${stepDistance} leads to ` +
                    `weired results. Turn of path smooting.`,
            );
        }

        // no steps possible - so return an empty path
        if (baseLength === stepDistance) {
            return Path.from([this.first, this.last]);
        }

        const tempCoordinates = this.coordinates.slice();
        const path = new Path<LatLng>();

        let remainingSteps = 0.0;
        let bearing;

        path.add(tempCoordinates[0]);
        let baseStep: T = tempCoordinates[0];

        for (
            let indexCoordinates = 0;
            indexCoordinates < this.coordinates.length - 1;
            indexCoordinates++
        ) {
            const distance = this._distance.distance(
                tempCoordinates[indexCoordinates],
                tempCoordinates[indexCoordinates + 1],
            );

            // Remember the direction
            bearing = this._distance.bearing(
                tempCoordinates[indexCoordinates],
                tempCoordinates[indexCoordinates + 1],
            );

            if (remainingSteps <= distance || stepDistance - remainingSteps <= distance) {
                // First step position
                let firstStepPos = stepDistance - remainingSteps;

                const steps = (distance - firstStepPos) / stepDistance + 1;

                const fullSteps = Math.trunc(steps);
                remainingSteps =
                    round(fullSteps > 0 ? steps % fullSteps : steps, { decimals: 6 }) *
                    stepDistance;

                baseStep = tempCoordinates[indexCoordinates];

                for (let stepCounter = 0; stepCounter < fullSteps; stepCounter++) {
                    // Add step on the given path
                    // Intermediate step is necessary to stay type-safe
                    const tempStep: LatLng = this._distance.offset(baseStep, firstStepPos, bearing);
                    const nextStep: LatLng = this.latLngFactory(
                        tempStep.latitude,
                        tempStep.longitude,
                    );

                    path.add(nextStep);
                    firstStepPos += stepDistance;

                    if (smoothPath) {
                        // Now - split it
                        let spline: CatmullRomSpline2D;

                        if (path.nrOfCoordinates === 3) {
                            spline = this._createSpline(
                                path.coordinates[0],
                                path.coordinates[0],
                                path.coordinates[1],
                                path.coordinates[2],
                            );

                            // Insert new point between 0 and 1
                            path._coordinates.splice(
                                1,
                                0,
                                this._pointToLatLng(spline.percentage(50)),
                            );
                        } else if (path.nrOfCoordinates > 3) {
                            const baseIndex = path.nrOfCoordinates - 1;
                            spline = this._createSpline(
                                path.coordinates[baseIndex - 3],
                                path.coordinates[baseIndex - 2],
                                path.coordinates[baseIndex - 1],
                                path.coordinates[baseIndex],
                            );

                            // Insert new point at last position - 2 (pushes the next 2 items down)
                            path._coordinates.splice(
                                baseIndex - 1,
                                0,
                                this._pointToLatLng(spline.percentage(50)),
                            );
                        }
                    }
                }
            } else {
                remainingSteps += distance;
            }
        }

        // If last step is on the same position as the last generated step
        // then don't add the last base step.
        if (
            baseStep.round().isNotEqual(tempCoordinates[tempCoordinates.length - 1].round()) &&
            baseStep.round().isNotEqual(tempCoordinates[0].round()) &&
            round(this._distance.distance(baseStep, tempCoordinates[tempCoordinates.length - 1])) >
                1
        ) {
            path.add(tempCoordinates[tempCoordinates.length - 1]);
        }

        if (smoothPath) {
            // Last Spline between the last 4 elements
            let baseIndex = path.nrOfCoordinates - 1;
            if (baseIndex > 3) {
                const spline = this._createSpline(
                    path.coordinates[baseIndex - 3],
                    path.coordinates[baseIndex - 2],
                    path.coordinates[baseIndex - 1],
                    path.coordinates[baseIndex],
                );

                path._coordinates.splice(
                    baseIndex - 1,
                    0,
                    this._pointToLatLng(spline.percentage(50)),
                );
            }

            // Check if there is a remaining gap between the last two elements - close it
            // Could be because of reminder from path divisions
            baseIndex = path.nrOfCoordinates - 1;
            if (
                this._distance.distance(
                    path.coordinates[baseIndex - 1],
                    path.coordinates[baseIndex],
                ) >= stepDistance
            ) {
                const spline = this._createSpline(
                    path.coordinates[baseIndex - 1],
                    path.coordinates[baseIndex - 1],
                    path.coordinates[baseIndex],
                    path.coordinates[baseIndex],
                );

                path._coordinates.splice(baseIndex, 0, this._pointToLatLng(spline.percentage(50)));
            }
        }

        // Make sure we have no duplicates!
        // _removeDuplicates();
        return path;
    }

    /// Sums up all the distances on the path
    ///
    ///     final Path path = new Path.from(route);
    ///     print(path.length);
    ///
    public get distance(): number {
        const tempCoordinates = this.coordinates.slice();
        let length = 0.0;

        for (let index = 0; index < this.coordinates.length - 1; index++) {
            length += this._distance.distance(tempCoordinates[index], tempCoordinates[index + 1]);
        }

        return round(length);
    }

    /** Returns the number of coordinates */
    public get nrOfCoordinates(): number {
        return this.coordinates.length;
    }

    /**
     * Calculates the center of a collection of geo coordinates
     *
     * The function rounds the result to 6 decimals
     */
    public get center(): LatLng {
        validate.notEmpty(this.coordinates, (): string => 'Coordinates must not be empty!');

        let X = 0.0;
        let Y = 0.0;
        let Z = 0.0;

        let lat;
        let lon;
        let hyp;

        this.coordinates.forEach((coordinate: LatLng): void => {
            lat = coordinate.latitudeInRad;
            lon = coordinate.longitudeInRad;

            X += Math.cos(lat) * Math.cos(lon);
            Y += Math.cos(lat) * Math.sin(lon);
            Z += Math.sin(lat);
        });

        const nrOfCoordinates = this.coordinates.length;
        X = X / nrOfCoordinates;
        Y = Y / nrOfCoordinates;
        Z = Z / nrOfCoordinates;

        lon = Math.atan2(Y, X);
        hyp = Math.sqrt(X * X + Y * Y);
        lat = Math.atan2(Z, hyp);

        return this.latLngFactory(round(radianToDeg(lat)), round(radianToDeg(lon)));
    }

    /** 4 Points are necessary to create a [CatmullRomSpline2D] */
    private _createSpline(p0: LatLng, p1: LatLng, p2: LatLng, p3: LatLng): CatmullRomSpline2D {
        validate.notNull(p0);
        validate.notNull(p1);
        validate.notNull(p2);
        validate.notNull(p3);

        return new CatmullRomSpline2D(
            new Point2D(p0.latitude, p0.longitude),
            new Point2D(p1.latitude, p1.longitude),
            new Point2D(p2.latitude, p2.longitude),
            new Point2D(p3.latitude, p3.longitude),
        );
    }

    /**
     * Convert [Point2D] to [LatLng]
     */
    private _pointToLatLng(point: Point2D): LatLng {
        return this.latLngFactory(point.x, point.y);
    }
}
