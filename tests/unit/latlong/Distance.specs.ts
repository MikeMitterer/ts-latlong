import 'jest-extended';
import { EARTH_RADIUS, normalizeBearing } from '../../../src/main/latlong/convert';
import { Distance } from '../../../src/main/latlong/Distance';
import { LatLng } from '../../../src/main/latlong/LatLng';
import { LengthUnit } from '../../../src/main/latlong/LengthUnit';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('Distance', (): void => {
    test('Radius', (): void => {
        expect(new Distance().radius).toBe(EARTH_RADIUS);
        expect(new Distance({ radius: 100 }).radius).toBe(100.0);
    });

    test('Distance to the same point is 0', (): void => {
        const compute = new Distance();
        const p = new LatLng(0.0, 0.0);

        expect(compute.distance(p, p)).toBe(0);
    });

    test('Distance between 0 and 90.0 is around 10.000km', (): void => {
        const distance = new Distance();
        const p1 = new LatLng(0.0, 0.0);
        const p2 = new LatLng(90.0, 0.0);

        // no rounding
        expect(Math.trunc(distance.distance(p1, p2) / 1000)).toBe(10001);

        expect(
            Math.round(LengthUnit.Meter.to(LengthUnit.Kilometer, distance.distance(p1, p2))),
        ).toBe(10002);

        // rounds to 10002
        expect(distance.as(LengthUnit.Kilometer, p1, p2)).toBe(10002);
        expect(distance.as(LengthUnit.Meter, p1, p2)).toBe(10001966);
    });

    test('Distance between 0 and 90.0 is 10001.96572931165 km (not rounded)', (): void => {
        const distance = new Distance({ roundResult: false });

        const p1 = new LatLng(0.0, 0.0);
        const p2 = new LatLng(90.0, 0.0);

        expect(distance.as(LengthUnit.Kilometer, p1, p2)).toBe(10001.96572931165);
    });

    test('distance between 0,-180 and 0,180 is 0', (): void => {
        const distance = new Distance();
        const p1 = new LatLng(0.0, -180.0);
        const p2 = new LatLng(0.0, 180.0);

        expect(distance.distance(p1, p2)).toBe(0);
    });

    describe('Vincenty', (): void => {
        test('Test 1', (): void => {
            const distance = new Distance();

            expect(
                distance.distance(
                    new LatLng(52.518611, 13.408056),
                    new LatLng(51.519475, 7.46694444),
                ),
            ).toBe(422592);

            expect(
                distance.as(
                    LengthUnit.Kilometer,
                    new LatLng(52.518611, 13.408056),
                    new LatLng(51.519475, 7.46694444),
                ),
            ).toBe(423);
        });
    });

    describe('Haversine - not so accurate', (): void => {
        test('Test 1', (): void => {
            const distance = Distance.useHaversine();

            expect(
                distance.distance(
                    new LatLng(52.518611, 13.408056),
                    new LatLng(51.519475, 7.46694444),
                ),
            ).toBe(421786.0);
            // expect( ).toBe( );
        });
    });

    describe('Bearing', (): void => {
        test('bearing to the same point is 0 degree', (): void => {
            const distance = new Distance();
            const p = new LatLng(0.0, 0.0);
            expect(distance.bearing(p, p)).toBe(0);
        });

        test('bearing between 0,0 and 90,0 is 0 degree', (): void => {
            const distance = new Distance();
            const p1 = new LatLng(0.0, 0.0);
            const p2 = new LatLng(90.0, 0.0);

            expect(distance.bearing(p1, p2)).toBe(0);
        });

        test('bearing between 0,0 and -90,0 is 180 degree', (): void => {
            const distance = new Distance();
            const p1 = new LatLng(0.0, 0.0);
            const p2 = new LatLng(-90.0, 0.0);
            expect(distance.bearing(p1, p2)).toBe(180);
        });

        test('bearing between 0,-90 and 0,90 is -90 degree', (): void => {
            const distance = new Distance();
            const p1 = new LatLng(0.0, -90.0);
            const p2 = new LatLng(0.0, 90.0);
            expect(distance.bearing(p1, p2)).toBe(90);
        });

        test('bearing between 0,-180 and 0,180 is -90 degree', (): void => {
            const distance = new Distance();
            const p1 = new LatLng(0.0, -180.0);
            const p2 = new LatLng(0.0, 180.0);

            expect(distance.bearing(p1, p2)).toBe(-90);
            expect(normalizeBearing(distance.bearing(p1, p2))).toBe(270);
        });
    });

    describe('Offset', (): void => {
        test('offset from 0,0 with bearing 0 and distance 10018.754 km is 90,180', (): void => {
            const distance = new Distance();

            const distanceInMeter = Math.round((EARTH_RADIUS * Math.PI) / 2);

            const p1 = new LatLng(0.0, 0.0);
            const p2 = distance.offset(p1, distanceInMeter, 0);

            expect(Math.round(p2.latitude)).toBe(90);
            expect(Math.round(p2.longitude)).toBe(180);
        });

        test('offset from 0,0 with bearing 180 and distance ~ 5.000 km is -45,0', (): void => {
            const distance = new Distance();
            const distanceInMeter = Math.round((EARTH_RADIUS * Math.PI) / 4);

            const p1 = new LatLng(0.0, 0.0);
            const p2 = distance.offset(p1, distanceInMeter, 180);

            expect(Math.round(p2.latitude)).toBe(-45);
            expect(Math.round(p2.longitude)).toBe(0);
        });

        test('offset from 0,0 with bearing 180 and distance ~ 10.000 km is -90,180', (): void => {
            const distance = new Distance();
            const distanceInMeter = Math.round((EARTH_RADIUS * Math.PI) / 2);

            const p1 = new LatLng(0.0, 0.0);
            const p2 = distance.offset(p1, distanceInMeter, 180);

            expect(Math.round(p2.latitude)).toBe(-90);
            expect(Math.round(p2.longitude)).toBe(180); // 0 Vincenty
        });

        test('offset from 0,0 with bearing 90 and distance ~ 5.000 km is 0,45', (): void => {
            const distance = new Distance();
            const distanceInMeter = Math.round((EARTH_RADIUS * Math.PI) / 4);

            const p1 = new LatLng(0.0, 0.0);
            const p2 = distance.offset(p1, distanceInMeter, 90);

            expect(Math.round(p2.latitude)).toBe(0);
            expect(Math.round(p2.longitude)).toBe(45);
        });
    });
});
