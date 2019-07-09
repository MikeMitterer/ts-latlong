import * as validate from '@mmit/validate';
import { DistanceCalculator } from './calculator/DistanceCalculator';
import { Vincenty } from './calculator/Vincenty';
import { Distance } from './Distance';
import { LatLng } from './LatLng';

/**
 * Circle-base GEO algorithms.
 *
 * Circle uses by default the Vincenty-Algorithm for distance computations
 */
class Circle {
    private readonly calculator: DistanceCalculator;

    public readonly radius: number;
    public readonly center: LatLng;

    // prettier-ignore
    constructor( center: LatLng, radius: number, {
        calculator = new Vincenty() }: { calculator?: DistanceCalculator } = {}) {

        this.radius = radius;
        this.center = center;
        this.calculator = calculator;
    }

    /**
     * Checks if a [point] is inside the given [Circle]
     *
     *     final Circle circle = new Circle(new LatLng(0.0,0.0), 111319.0);
     *     final LatLng newPos = new LatLng(1.0,0.0);
     *
     *     expect(circle.isPointInside(newPos),isTrue);
     *
     *     final Circle circle2 = new Circle(new LatLng(0.0,0.0), 111318.0);
     *
     *     expect(circle2.isPointInside(newPos),isFalse);
     *
     */
    public isPointInside(point: LatLng): boolean {
        validate.notNull(point);

        const distance = new Distance({ calculator: this.calculator });
        const dist = distance.distance(this.center, point);

        return dist <= this.radius;
    }
}
