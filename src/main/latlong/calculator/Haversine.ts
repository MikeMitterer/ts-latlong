import * as validate from '@mmit/validate';
import { degToRadian, EQUATOR_RADIUS, radianToDeg } from '../convert';
import { LatLng } from '../LatLng';
import { DistanceCalculator } from './DistanceCalculator';

/**
 * Calculates distance with Haversine algorithm.
 *
 * Accuracy can be out by 0.3%
 * More on [Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula)
 */
export class Haversine implements DistanceCalculator {
    /**
     * Calculates distance with Haversine algorithm.
     */
    public distance(p1: LatLng, p2: LatLng): number {
        const sinDLat = Math.sin((p2.latitudeInRad - p1.latitudeInRad) / 2);
        const sinDLng = Math.sin((p2.longitudeInRad - p1.longitudeInRad) / 2);

        // Sides
        const a =
            sinDLat * sinDLat +
            sinDLng * sinDLng * Math.cos(p1.latitudeInRad) * Math.cos(p2.latitudeInRad);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EQUATOR_RADIUS * c;
    }

    public offset(from: LatLng, distanceInMeter: number, bearing: number): LatLng {
        validate.inclusiveBetween(
            bearing,
            -180,
            180,
            (): string => `Angle must be between -180 and 180 degrees but was ${bearing}`,
        );

        const h = degToRadian(bearing);

        const a = distanceInMeter / EQUATOR_RADIUS;

        const lat2 = Math.asin(
            Math.sin(from.latitudeInRad) * Math.cos(a) +
                Math.cos(from.latitudeInRad) * Math.sin(a) * Math.cos(h),
        );

        const lng2 =
            from.longitudeInRad +
            Math.atan2(
                Math.sin(h) * Math.sin(a) * Math.cos(from.latitudeInRad),
                Math.cos(a) - Math.sin(from.latitudeInRad) * Math.sin(lat2),
            );

        return new LatLng(radianToDeg(lat2), radianToDeg(lng2));
    }
}
