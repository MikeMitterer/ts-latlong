import 'jest-extended';
import { Haversine } from '../../../src/main/latlong/calculator/Haversine';
import { Circle } from '../../../src/main/latlong/Circle';
import { Distance } from '../../../src/main/latlong/Distance';
import { LatLng } from '../../../src/main/latlong/LatLng';

describe('Circle', (): void => {
    // const logger = loggerFactory.getLogger('test.Circle');

    const base = new LatLng(0.0, 0.0);

    describe('with Vincenty', (): void => {
        test('isInside', (): void => {
            const circle1 = new Circle(new LatLng(0.0, 0.0), 110574.0);
            const newPos = new LatLng(1.0, 0.0);

            // final double dist = new Distance().distance(circle.center,newPos);
            // print(dist);

            expect(circle1.isPointInside(newPos)).toBeTrue();

            const circle2 = new Circle(new LatLng(0.0, 0.0), 110573.0);
            expect(circle2.isPointInside(newPos)).toBeFalse();
        });

        bearingTests(base, new Circle(base, 1000.0), Distance.useVincenty());
    });

    describe('with Haversine', (): void => {
        bearingTests(
            base,
            new Circle(base, 1000.0, { calculator: new Haversine() }),
            Distance.useHaversine(),
        );
    });
});

function bearingTests(base: LatLng, circle: Circle, distance: Distance): void {
    test('isInside bearing 0', (): void => {
        const bearing = 0;

        [100, 500, 999, 1000].forEach((dist: number): void => {
            expect(circle.isPointInside(distance.offset(base, dist, bearing))).toBeTrue();
        });

        expect(circle.isPointInside(distance.offset(base, 1001, bearing))).toBeFalse();
    });

    test('isInside, bearing 90', (): void => {
        const bearing = 90;

        [100, 500, 999, 1000].forEach((dist: number): void => {
            expect(circle.isPointInside(distance.offset(base, dist, bearing))).toBeTrue();
        });

        expect(circle.isPointInside(distance.offset(base, 1001, bearing))).toBeFalse();
    });

    test('isInside, bearing -90', (): void => {
        const bearing = -90;

        [100, 500, 999, 1000].forEach((dist: number): void => {
            expect(circle.isPointInside(distance.offset(base, dist, bearing))).toBeTrue();
        });

        expect(circle.isPointInside(distance.offset(base, 1001, bearing))).toBeFalse();
    });

    test('isInside, bearing 180', (): void => {
        const bearing = 180;

        [100, 500, 999, 1000].forEach((dist: number): void => {
            expect(circle.isPointInside(distance.offset(base, dist, bearing))).toBeTrue();
        });

        expect(circle.isPointInside(distance.offset(base, 1001, bearing))).toBeFalse();
    });

    test('isInside, bearing -180', (): void => {
        const bearing = -180;

        [100, 500, 999, 1000].forEach((dist: number): void => {
            expect(circle.isPointInside(distance.offset(base, dist, bearing))).toBeTrue();
        });

        expect(circle.isPointInside(distance.offset(base, 1001, bearing))).toBeFalse();
    });
}
