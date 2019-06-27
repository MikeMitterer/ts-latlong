import * as validate from '@mmit/validate';
import { decimal2sexagesimal, degToRadian, round } from './convert';

// tslint:disable-next-line:no-any
export function isLatLng(object: any): object is LatLng {
    return typeof object === 'object' && object instanceof LatLng;
}

/**
 * Coordinates in Degrees
 *
 *      const latlng = new LatLng(10.000002,12.00001);
 */
export class LatLng {
    private _latitude: number;
    private _longitude: number;

    constructor(latitude: number, longitude: number) {
        validate.inclusiveBetween(
            latitude,
            -90.0,
            90.0,
            (): string => `"Latitude must be between -90 and 90 degrees but was ${latitude}"`,
        );

        validate.inclusiveBetween(
            longitude,
            -180.0,
            180.0,
            (): string => `"Longitude must be between -180 and 180 degrees but was ${latitude}"`,
        );

        this._latitude = latitude;
        this._longitude = longitude;
    }

    public set latitude(value: number) {
        validate.inclusiveBetween(
            value,
            -90.0,
            90.0,
            (): string => `"Latitude must be between -90 and 90 degrees but was ${value}"`,
        );
        this._latitude = value;
    }

    public get latitude(): number {
        return this._latitude;
    }

    public set longitude(value: number) {
        validate.inclusiveBetween(
            value,
            -180.0,
            180.0,
            (): string => `"Longitude must be between -180 and 180 degrees but was ${value}"`,
        );

        this._longitude = value;
    }

    public get longitude(): number {
        return this._longitude;
    }

    public get latitudeInRad(): number {
        return degToRadian(this.latitude);
    }

    public get longitudeInRad(): number {
        return degToRadian(this.longitude);
    }

    public toString(): string {
        return (
            `LatLng(latitude:${this.latitude.toFixed(6)}, ` +
            `longitude:${this.longitude.toFixed(6)})`
        );
    }

    /**
     * Converts lat/long values into sexagesimal
     *
     *     final LatLng p1 = new LatLng(51.519475, -19.37555556);
     *
     *     // Shows: 51° 31' 10.11" N, 19° 22' 32.00" W
     *     print(p1..toSexagesimal());
     */
    public toSexagesimal(): string {
        const latDirection = this.latitude >= 0 ? 'N' : 'S';
        const lonDirection = this.longitude >= 0 ? 'O' : 'W';

        return `${decimal2sexagesimal(this.latitude)} ${latDirection}, ${decimal2sexagesimal(
            this.longitude,
        )} ${lonDirection}`;
    }

    public round({ decimals }: { decimals: number } = { decimals: 6 }): LatLng {
        return new LatLng(round(this.latitude, { decimals }), round(this.longitude, { decimals }));
    }

    public isEqual(other: LatLng): boolean {
        if (isLatLng(other)) {
            return this.latitude === other.latitude && this.longitude === other.longitude;
        }
        return false;
    }

    public isNotEqual(other: LatLng): boolean {
        return !this.isEqual(other);
    }
}
