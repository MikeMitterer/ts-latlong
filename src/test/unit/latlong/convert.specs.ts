import 'jest-extended';
import { decimal2sexagesimal, round } from '../../../main/latlong/convert';
import { LatLng } from '../../../main/latlong/LatLng';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('convert', () => {
    // const logger = loggerFactory.getLogger('test.convert');

    test('Round to string', () => {
        expect(`${round(1.0, { decimals: 10 }).toFixed(10)}`).toBe('1.0000000000');
    });

    test('decimal2sexagesimal', () => {
        const sexa1 = decimal2sexagesimal(51.519475);
        const sexa2 = decimal2sexagesimal(-19.37555556);
        const sexa3 = decimal2sexagesimal(50.0);
        const sexa4 = decimal2sexagesimal(50);

        expect(sexa1).toBe('51° 31\' 10.11"');
        expect(sexa2).toBe('19° 22\' 32.00"');
        expect(sexa3).toBe('50° 0\' 0.00"');
        expect(sexa4).toBe('50° 0\' 0.00"');

        const p1 = new LatLng(51.519475, -19.37555556);
        expect(p1.toSexagesimal()).toBe(`51° 31' 10.11" N, 19° 22' 32.00" W`);
    });
});
