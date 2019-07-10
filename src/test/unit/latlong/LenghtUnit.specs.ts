import 'jest-extended';
import { LengthUnit } from '../../../main/latlong/LengthUnit';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('LengthUnit', () => {
    test('> Millimeter', () => {
        expect(LengthUnit.Millimeter.to(LengthUnit.Millimeter, 1.0)).toBe(1.0);
        expect(LengthUnit.Millimeter.to(LengthUnit.Centimeter, 1.0)).toBe(0.1);
        expect(LengthUnit.Millimeter.to(LengthUnit.Meter, 1000.0)).toBe(1.0);
        expect(LengthUnit.Millimeter.to(LengthUnit.Kilometer, 1000000.0)).toBe(1);
    });

    test('> Centimeter', () => {
        expect(LengthUnit.Centimeter.to(LengthUnit.Centimeter, 1.0)).toBe(1.0);
        expect(LengthUnit.Centimeter.to(LengthUnit.Millimeter, 1.0)).toBe(10.0);
    });

    test('> Meter', () => {
        expect(LengthUnit.Meter.to(LengthUnit.Meter, 100.0)).toBe(100.0);
        expect(LengthUnit.Meter.to(LengthUnit.Kilometer, 1.0)).toBe(0.001);
    });

    test('> Kilometer', () => {
        expect(LengthUnit.Kilometer.to(LengthUnit.Kilometer, 1.0)).toBe(1.0);
        expect(LengthUnit.Kilometer.to(LengthUnit.Meter, 1.0)).toBe(1000.0);
    });

    test('> Mile', () => {
        expect(Math.round(LengthUnit.Mile.to(LengthUnit.Meter, 1.0) * 100) / 100).toBe(1609.34);
    });
});
