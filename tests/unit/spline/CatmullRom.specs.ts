import { ArgumentError } from '@mmit/validate';
import 'jest-extended';
import {
    CatmullRomSpline,
    CatmullRomSpline2D,
    Point2D,
} from '../../../src/main/spline/CatmullRomSpline';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('CatmullRom', (): void => {
    describe('CatmullRom 1D', (): void => {
        test('> one dimension', (): void => {
            const spline = new CatmullRomSpline(1, 2, 2, 1);

            expect(spline.position(0.25)).toBe(2.09375);
            expect(spline.position(0.5)).toBe(2.125);
            expect(spline.position(0.75)).toBe(2.09375);
        });

        test('> no endpoints', (): void => {
            const spline = CatmullRomSpline.noEndpoints(1, 2);

            expect(spline.position(0.25)).toBe(1.203125);
            expect(spline.position(0.5)).toBe(1.5);
            expect(spline.percentage(50)).toBe(1.5);

            expect(spline.position(0.75)).toBe(1.796875);
        });
    });

    describe('CatmullRom 2D', (): void => {
        test('> Simple values', (): void => {
            const spline = new CatmullRomSpline2D(
                new Point2D(1, 1),
                new Point2D(2, 2),
                new Point2D(2, 2),
                new Point2D(1, 1),
            );

            expect(spline.position(0.25).x).toBe(2.09375);
            expect(spline.position(0.25).y).toBe(2.09375);

            expect(spline.position(0.5).x).toBe(2.125);
            expect(spline.position(0.5).y).toBe(2.125);
            expect(spline.percentage(50).x).toBe(2.125);
            expect(spline.percentage(50).y).toBe(2.125);

            expect(spline.position(0.75).x).toBe(2.09375);
            expect(spline.position(0.75).y).toBe(2.09375);
        });

        test('> no Endpoints', (): void => {
            const spline = CatmullRomSpline2D.noEndpoints(new Point2D(1, 1), new Point2D(2, 2));

            expect(spline.position(0.25).x).toBe(1.203125);
            expect(spline.position(0.25).y).toBe(1.203125);
        }); // end of 'no Endpoints' test

        test('> Exception', (): void => {
            const spline = CatmullRomSpline2D.noEndpoints(new Point2D(1, 1), new Point2D(2, 2));

            expect((): number => spline.position(3.0).x).toThrow(ArgumentError);
        }); // end of 'Exception' test
    });
});
