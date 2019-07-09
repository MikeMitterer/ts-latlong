import { degToRadian, EQUATOR_RADIUS, FLATTENING, POLAR_RADIUS, radianToDeg } from '../convert';
import { StateError } from '../exception/StateError';
import { LatLng } from '../LatLng';
import { DistanceCalculator } from './DistanceCalculator';

/**
 * Calculates distance with Vincenty algorithm.
 *
 * Accuracy is about 0.5mm
 * More on [Wikipedia](https://en.wikipedia.org/wiki/Vincenty%27s_formulae)
 */
export class Vincenty implements DistanceCalculator {
    /**
     * Calculates distance with Vincenty algorithm.
     *
     * Accuracy is about 0.5mm
     * More on [Wikipedia](https://en.wikipedia.org/wiki/Vincenty%27s_formulae)
     */
    public distance(p1: LatLng, p2: LatLng): number | never {
        const a = EQUATOR_RADIUS;
        const b = POLAR_RADIUS;
        const f = FLATTENING; // WGS-84 ellipsoid params

        const L = p2.longitudeInRad - p1.longitudeInRad;
        const U1 = Math.atan((1 - f) * Math.tan(p1.latitudeInRad));
        const U2 = Math.atan((1 - f) * Math.tan(p2.latitudeInRad));
        const sinU1 = Math.sin(U1);
        const cosU1 = Math.cos(U1);
        const sinU2 = Math.sin(U2);
        const cosU2 = Math.cos(U2);

        let sinLambda;
        let cosLambda;
        let sinSigma;
        let cosSigma;
        let sigma;
        let sinAlpha;
        let cosSqAlpha;
        let cos2SigmaM;
        let lambda = L;
        let lambdaP;
        let maxIterations = 200;

        do {
            sinLambda = Math.sin(lambda);
            cosLambda = Math.cos(lambda);
            sinSigma = Math.sqrt(
                cosU2 * sinLambda * (cosU2 * sinLambda) +
                    (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
                        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda),
            );

            if (sinSigma === 0) {
                return 0.0; // co-incident points
            }

            cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
            sigma = Math.atan2(sinSigma, cosSigma);
            sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
            cosSqAlpha = 1 - sinAlpha * sinAlpha;
            cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;

            if (isNaN(cos2SigmaM)) {
                cos2SigmaM = 0.0; // equatorial line: cosSqAlpha=0 (§6)
            }

            const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
            lambdaP = lambda;
            lambda =
                L +
                (1 - C) *
                    f *
                    sinAlpha *
                    (sigma +
                        C *
                            sinSigma *
                            (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
        } while (Math.abs(lambda - lambdaP) > 1e-12 && --maxIterations > 0);

        if (maxIterations === 0) {
            throw new StateError('Distance calculation failed to converge!');
        }

        const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
        const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        const deltaSigma =
            B *
            sinSigma *
            (cos2SigmaM +
                (B / 4) *
                    (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                        (B / 6) *
                            cos2SigmaM *
                            (-3 + 4 * sinSigma * sinSigma) *
                            (-3 + 4 * cos2SigmaM * cos2SigmaM)));

        const dist = b * A * (sigma - deltaSigma);

        return dist;
    }

    /**
     * Vincenty inverse calculation
     *
     * More on [Wikipedia](https://en.wikipedia.org/wiki/Vincenty%27s_formulae)
     */
    public offset(from: LatLng, distanceInMeter: number, bearing: number): LatLng {
        const equatorialRadius = EQUATOR_RADIUS;
        const polarRadius = POLAR_RADIUS;
        const flattening = FLATTENING; // WGS-84 ellipsoid params

        const latitude = from.latitudeInRad;
        const longitude = from.longitudeInRad;

        const alpha1 = degToRadian(bearing);
        const sinAlpha1 = Math.sin(alpha1);
        const cosAlpha1 = Math.cos(alpha1);

        const tanU1 = (1 - flattening) * Math.tan(latitude);
        const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
        const sinU1 = tanU1 * cosU1;

        const sigma1 = Math.atan2(tanU1, cosAlpha1);
        const sinAlpha = cosU1 * sinAlpha1;
        const cosSqAlpha = 1 - sinAlpha * sinAlpha;
        const dfUSq =
            (cosSqAlpha * (equatorialRadius * equatorialRadius - polarRadius * polarRadius)) /
            (polarRadius * polarRadius);
        const a = 1 + (dfUSq / 16384) * (4096 + dfUSq * (-768 + dfUSq * (320 - 175 * dfUSq)));
        const b = (dfUSq / 1024) * (256 + dfUSq * (-128 + dfUSq * (74 - 47 * dfUSq)));

        let sigma = distanceInMeter / (polarRadius * a);
        let sigmaP = 2 * Math.PI;

        let sinSigma = 0.0;
        let cosSigma = 0.0;
        let cos2SigmaM = 0.0;
        let deltaSigma;
        let maxIterations = 200;

        do {
            cos2SigmaM = Math.cos(2 * sigma1 + sigma);
            sinSigma = Math.sin(sigma);
            cosSigma = Math.cos(sigma);
            deltaSigma =
                b *
                sinSigma *
                (cos2SigmaM +
                    (b / 4) *
                        (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                            (b / 6) *
                                cos2SigmaM *
                                (-3 + 4 * sinSigma * sinSigma) *
                                (-3 + 4 * cos2SigmaM * cos2SigmaM)));
            sigmaP = sigma;
            sigma = distanceInMeter / (polarRadius * a) + deltaSigma;
        } while (Math.abs(sigma - sigmaP) > 1e-12 && --maxIterations > 0);

        if (maxIterations === 0) {
            throw new StateError('offset calculation faild to converge!');
        }

        const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
        const lat2 = Math.atan2(
            sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
            (1 - flattening) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp),
        );

        const lambda = Math.atan2(
            sinSigma * sinAlpha1,
            cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1,
        );
        const c = (flattening / 16) * cosSqAlpha * (4 + flattening * (4 - 3 * cosSqAlpha));
        const l =
            lambda -
            (1 - c) *
                flattening *
                sinAlpha *
                (sigma +
                    c *
                        sinSigma *
                        (cos2SigmaM + c * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

        let lon2 = longitude + l;
        // print("LA ${radianToDeg(lat2)}, LO ${radianToDeg(lon2)}");

        if (lon2 > Math.PI) {
            lon2 = lon2 - 2 * Math.PI;
        }
        if (lon2 < -1 * Math.PI) {
            lon2 = lon2 + 2 * Math.PI;
        }

        return new LatLng(radianToDeg(lat2), radianToDeg(lon2));
    }
}
