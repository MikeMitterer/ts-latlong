import * as validate from '@mmit/validate';

export class Point2D {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export abstract class CatmullRom<R> {
    public abstract position(distance: number): R;

    public percentage(percent: number): R {
        return this.position(percent / 100);
    }
}

export class CatmullRomSpline extends CatmullRom<number> {
    public constructor(
        private _p0: number,
        private _p1: number,
        private _p2: number,
        private _p3: number,
    ) {
        super();
    }

    public static noEndpoints(p1: number, p2: number): CatmullRomSpline {
        return new CatmullRomSpline(p1, p1, p2, p2);
    }

    public position(distance: number): number {
        validate.inclusiveBetween(
            distance,
            0,
            1,
            (): string => `Distance must be between 0 and 1 but was ${distance}`,
        );

        return (
            0.5 *
            (2 * this._p1 +
                (this._p2 - this._p0) * distance +
                (2 * this._p0 - 5 * this._p1 + 4 * this._p2 - this._p3) * distance * distance +
                (3 * this._p1 - this._p0 - 3 * this._p2 + this._p3) *
                    distance *
                    distance *
                    distance)
        );
    }
}

export class CatmullRomSpline2D extends CatmullRom<Point2D> {
    // prettier-ignore
    public constructor(
        private _p0: Point2D,
        private _p1: Point2D,
        private _p2: Point2D,
        private _p3: Point2D) {

        super();
    }

    // prettier-ignore
    public static noEndpoints( _p0: Point2D, _p1: Point2D): CatmullRomSpline2D {
        return new CatmullRomSpline2D(_p0, _p0, _p1, _p1);
    }

    public position(distance: number): Point2D {
        validate.inclusiveBetween(
            distance,
            0,
            1,
            (): string => `Distance must be between 0 and 1 but was ${distance}`,
        );

        return new Point2D(
            new CatmullRomSpline(this._p0.x, this._p1.x, this._p2.x, this._p3.x).position(distance),
            new CatmullRomSpline(this._p0.y, this._p1.y, this._p2.y, this._p3.y).position(distance),
        );
    }
}
