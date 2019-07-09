import { LatLng } from '../LatLng';

export interface DistanceCalculator {
    distance(p1: LatLng, p2: LatLng): number;

    offset(from: LatLng, distanceInMeter: number, bearing: number): LatLng;
}
