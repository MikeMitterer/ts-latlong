import { DistanceCalculator } from './calculator/DistanceCalculator';
import { Haversine } from './calculator/Haversine';
import { Vincenty } from './calculator/Vincenty';
import { EARTH_RADIUS, radianToDeg } from './convert';
import { LatLng } from './LatLng';
import { LengthUnit } from './LengthUnit';

/**
 * Calculates the distance between points.
 *
 * Default algorithm is [distanceWithVincenty], default radius is [EARTH_RADIUS]
 *
 *      final Distance distance = new Distance();
 *
 *      // km = 423
 *      final int km = distance.as(LengthUnit.Kilometer,
 *         new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
 *
 *      // meter = 422592
 *      final int meter = distance(new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
 */
export class Distance implements DistanceCalculator {
    private readonly radius: number;
    private readonly roundResult: boolean;

    /** Returns either [Haversine] oder [Vincenty] calculator */
    private readonly calculator: DistanceCalculator;

    // prettier-ignore
    constructor({radius = EARTH_RADIUS, roundResult = true, calculator = new Vincenty()}:
                    { radius?: number, roundResult?: boolean, calculator?: DistanceCalculator } = {}) {

        this.radius = radius;
        this.roundResult = roundResult;
        this.calculator = calculator;
    }

    /**
     * Shortcut for creating a Vincenty-Distance-Calculator
     *
     * const calculator = Distance.useVincenty()
     */
    public static useVincenty({
        radius = EARTH_RADIUS,
        roundResult = true,
    }: { radius?: number; roundResult?: boolean } = {}): Distance {
        return new Distance({ radius, roundResult, calculator: new Vincenty() });
    }

    /**
     * Shortcut for creating a Haversine-Distance-Calculator
     *
     * const calculator = Distance.useHaversine()
     */
    public static useHaversine({
        radius = EARTH_RADIUS,
        roundResult = true,
    }: { radius?: number; roundResult?: boolean } = {}): Distance {
        return new Distance({ radius, roundResult, calculator: new Haversine() });
    }

    /**
     * Converts the distance to the given [LengthUnit]
     *
     *     const km = distance.as(LengthUnit.Kilometer,
     *         new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
     */
    public as(unit: LengthUnit, p1: LatLng, p2: LatLng): number {
        const dist = this.calculator.distance(p1, p2);
        return this.round(LengthUnit.Meter.to(unit, dist));
    }

    /**
     * Computes the distance between two points.
     *
     * The function uses the [DistanceAlgorithm] specified in the CTOR
     */
    public distance(p1: LatLng, p2: LatLng): number {
        return this.round(this.calculator.distance(p1, p2));
    }

    /**
     * Returns the great circle bearing (direction) in degrees to the next point ([p2])
     *
     * Find out about the difference between rhumb line and
     * great circle bearing on
     * [Wikipedia](http://en.wikipedia.org/wiki/Rhumb_line#General_and_mathematical_description).
     *
     *     final Distance distance = const Distance();
     *
     *     final LatLng p1 = new LatLng(0.0, 0.0);
     *     final LatLng p2 = new LatLng(-90.0, 0.0);
     *
     *     expect(distance.direction(p1, p2), equals(180));
     */
    public bearing(p1: LatLng, p2: LatLng): number {
        const diffLongitude = p2.longitudeInRad - p1.longitudeInRad;

        const y = Math.sin(diffLongitude);
        const x =
            Math.cos(p1.latitudeInRad) * Math.tan(p2.latitudeInRad) -
            Math.sin(p1.latitudeInRad) * Math.cos(diffLongitude);

        return radianToDeg(Math.atan2(y, x));
    }

    /**
     * Returns a destination point based on the given [distance] and [bearing]
     *
     * Given a [from] (start) point, initial [bearing], and [distance],
     * this will calculate the destination point and
     * final bearing travelling along a (shortest distance) great circle arc.
     *
     *     final Distance distance = const Distance();
     *
     *     final num distanceInMeter = (EARTH_RADIUS * math.PI / 4).round();
     *
     *     final p1 = new LatLng(0.0, 0.0);
     *     final p2 = distance.offset(p1, distanceInMeter, 180);
     *
     * Bearing: Left - 270°, right - 90°, up - 0°, down - 180°
     */
    public offset(from: LatLng, distanceInMeter: number, bearing: number): LatLng {
        return this.calculator.offset(from, distanceInMeter, bearing);
    }

    private round(value: number): number {
        return this.roundResult ? Math.round(value) : value;
    }
}
