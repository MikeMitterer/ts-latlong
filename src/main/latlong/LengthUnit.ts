export class LengthUnit {
    public static readonly Millimeter: LengthUnit = new LengthUnit(1000);
    public static readonly Centimeter: LengthUnit = new LengthUnit(100);
    public static readonly Meter: LengthUnit = new LengthUnit(1);
    public static readonly Kilometer: LengthUnit = new LengthUnit(0.001);
    public static readonly Mile: LengthUnit = new LengthUnit(0.0006213712);

    public readonly scaleFactor: number;

    constructor(scaleFactor: number) {
        this.scaleFactor = scaleFactor;
    }

    public to(unit: LengthUnit, value: number): number {
        if (unit.scaleFactor === this.scaleFactor) {
            return value;
        }

        // Convert to primary unit.
        const primaryValue = value / this.scaleFactor;

        // Convert to destination unit.
        return primaryValue * unit.scaleFactor;
    }
}
