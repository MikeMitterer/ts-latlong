import * as validate from '@mmit/validate';
import 'jest-extended';
import { isLatLng, LatLng } from '../../../main/latlong/LatLng';

// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('LatLng', () => {
    // const logger = loggerFactory.getLogger('test.LatLng');

    test('round', () => {
        const latlng = new LatLng(1.123456789, 2.123456789);
        const rounded = latlng.round();

        expect(rounded.latitude).toBe(1.123457);
        expect(rounded.longitude).toBe(2.123457);
    });

    test('Range', () => {
        expect(() => new LatLng(-80.0, 0.0)).not.toThrowError();
        expect(() => new LatLng(-100.0, 0.0)).toThrow(validate.ArgumentError);

        expect(() => new LatLng(80.0, 0.0)).not.toThrowError();
        expect(() => new LatLng(100.0, 0.0)).toThrow(validate.ArgumentError);

        expect(() => new LatLng(0.0, -170.0)).not.toThrowError();
        expect(() => new LatLng(0.0, -190.0)).toThrow(validate.ArgumentError);

        expect(() => new LatLng(0.0, 170.0)).not.toThrowError();
        expect(() => new LatLng(0.0, 190.0)).toThrow(validate.ArgumentError);
    });

    test('Rad', () => {
        expect(new LatLng(-80.0, 0.0).latitudeInRad).toBe(-1.3962634015954636);
        expect(new LatLng(90.0, 0.0).latitudeInRad).toBe(1.5707963267948966);
        expect(new LatLng(0.0, 80.0).longitudeInRad).toBe(1.3962634015954636);
        expect(new LatLng(0.0, 90.0).longitudeInRad).toBe(1.5707963267948966);
    });

    test('toString', () => {
        expect(new LatLng(-80.0, 0.0).toString()).toBe(
            'LatLng(latitude:-80.000000, longitude:0.000000)',
        );

        expect(new LatLng(-80.123456, 0.0).toString()).toBe(
            'LatLng(latitude:-80.123456, longitude:0.000000)',
        );
    });

    test('Type', () => {
        expect(isLatLng(new LatLng(-5, 0))).toBeTrue();
        expect(isLatLng({ latitude: -5, longitude: 0 })).not.toBeTrue();

        // expect( ).toBe( );
    });

    test('isEqual', () => {
        expect(new LatLng(-80.0, 0.0).isEqual(new LatLng(-80.0, 0.0))).toBeTrue();

        expect(new LatLng(-80.0, 0.0).isEqual(new LatLng(-80.1, 0.0))).not.toBeTrue();

        expect(new LatLng(-80.0, 0.0).isNotEqual(new LatLng(0.0, 80.0))).toBeTrue();
    });
});
