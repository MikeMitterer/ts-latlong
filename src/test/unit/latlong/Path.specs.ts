import { LoggerFactory, LogLevel } from '@mmit/logging';
import 'jest-extended';
import { round } from '../../../main/latlong/convert';
import { Distance } from '../../../main/latlong/Distance';
import { LatLng } from '../../../main/latlong/LatLng';
import { LengthUnit } from '../../../main/latlong/LengthUnit';
import { Path } from '../../../main/latlong/Path';
import { cities, route, westendorf, zigzag } from '../_resources/testpath';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

const logger = LoggerFactory.for('latlong.test.unit.latlong.Path')
    .level(LogLevel.INFO)
    .get();

describe('Path', (): void => {
    test(
        '> The total size of a path with 1000m length divided by 10sections must have the same' +
            'length as the base path',
        (): void => {
            const distance = new Distance();
            const startPos = new LatLng(0.0, 0.0);
            const endPos = distance.offset(startPos, 1000, 0);

            expect(distance.distance(startPos, endPos)).toBe(1000);

            const path = Path.from([startPos, endPos]);
            expect(path.distance).toBe(1000);
            expect(path.coordinates.length).toBe(2);

            const steps = path.equalize(100, { smoothPath: false });

            // exportForGoogleEarth(steps, { showIndex: false });
            expect(steps.distance).toBe(1000);
            expect(steps.coordinates.length).toBe(11);
        },
    );

    test(
        '> 10 smoothd out steps in total have approximatly!!! the same length ' +
            'as the base path',
        (): void => {
            const distance = new Distance();
            const startPos = new LatLng(0.0, 0.0);
            const endPos = distance.offset(startPos, 1000, 0);

            expect(distance.distance(startPos, endPos)).toBe(1000);

            const path = Path.from([startPos, endPos]);
            expect(path.distance).toBe(1000);

            const steps = path.equalize(100, { smoothPath: false });

            expect(steps.distance).toBeWithin(999, 1001);
            expect(steps.coordinates.length).toBe(11);

            // exportForGoogleEarth(steps, { showIndex: false });
            for (let index = 0; index < steps.nrOfCoordinates - 1; index++) {
                // 46?????
                expect(
                    distance.distance(steps.coordinates[index], steps.coordinates[index + 1]),
                ).toBeWithin(46, 112);
            }
        },
    );

    test('Path with 3 sections', (): void => {
        const distance = new Distance();
        const startPos = new LatLng(0.0, 0.0);
        const pos1 = distance.offset(startPos, 50, 0);
        const pos2 = distance.offset(pos1, 15, 0);
        const pos3 = distance.offset(pos2, 5, 0);

        expect(distance.distance(startPos, pos3)).toBe(70);

        const path = Path.from([startPos, pos1, pos2, pos3]);
        expect(path.distance).toBe(70);

        const steps = path.equalize(30, { smoothPath: false });
        // exportForGoogleEarth(steps, { showIndex: false });

        expect(steps.nrOfCoordinates).toBe(4);
    });

    test('> Reality Test - Westendorf, short, should 210m (same as Google Earth)', (): void => {
        const path = Path.from(westendorf);
        expect(path.distance).toBe(210);

        // first point to last point!
        const distance = new Distance();
        expect(distance.distance(westendorf[0], westendorf[westendorf.length - 1])).toBe(209);

        const steps = path.equalize(5);
        expect(steps.nrOfCoordinates).toBe(44);

        // exportForGoogleEarth(steps, { showIndex: false });
    });

    test(
        '> ZigZag, according to Google-Earth - 282m,' +
            'first to last point 190m (acc. movable-type.co.uk (Haversine)',
        (): void => {
            const path = Path.from(zigzag);
            expect(path.distance).toBe(282);

            // first point to last point!
            const distance = new Distance();
            expect(distance.distance(zigzag[0], zigzag[zigzag.length - 1])).toBe(190);

            const steps = path.equalize(8, { smoothPath: true });

            // 282 / 8 = 35,25 + first + last
            expect(steps.nrOfCoordinates).toBe(36);
            expect(steps.coordinates.length).toBeWithin(36, 37);

            // exportForGoogleEarth(steps, { showIndex: false });

            // Distance check makes no sense - path is shorter than the original one!

            // double sumDist = 0.0;
            // for(int index = 0;index < steps.nrOfCoordinates - 1;index++) {
            //    sumDist += distance(steps[index],steps[index + 1]);
            // }
        },
    );

    describe('PathLength', (): void => {
        test('> Distance of empty path should be 0', (): void => {
            const path = new Path();

            expect(path.distance).toBe(0);
        });

        test('> Path length should be 3377m', (): void => {
            const path = Path.from(route);

            expect(path.distance).toBe(3377);
        });

        test('> Path lenght should be 3.377km', (): void => {
            const path = Path.from(route);

            expect(
                round(LengthUnit.Meter.to(LengthUnit.Kilometer, path.distance), { decimals: 3 }),
            ).toBe(3.377);
        });
    });

    describe('Center', (): void => {
        test(
            '> Center between Berlin and Moscow should be near Minsk ' + '(54.743683,25.033239)',
            (): void => {
                const path = Path.from([cities.berlin, cities.moscow]);

                expect(path.center.latitude).toBe(54.743683);
                expect(path.center.longitude).toBe(25.033239);
            },
        );
    });

    describe('Utils', (): void => {
        test('> Round', (): void => {
            expect(round(123.1)).toBe(123.1);
            expect(round(123.123456)).toBe(123.123456);
            expect(round(123.1234567)).toBe(123.123457);
            expect(round(123.1234565)).toBe(123.123457);
            expect(round(123.1234564)).toBe(123.123456);
            expect(round(123.1234564, { decimals: 0 })).toBe(123);
            expect(round(123.1234564, { decimals: -1 })).toBe(120);
            expect(round(123.1234564, { decimals: -3 })).toBe(0);
            expect(round(523.1234564, { decimals: -3 })).toBe(1000);
            expect(round(423.1234564, { decimals: -3 })).toBe(0);
        });
    });
});

/**
 * Print CSV-date on the cmdline
 */
// prettier-ignore
function exportForGoogleEarth( steps: Path<LatLng>, { showIndex = true }: { showIndex?: boolean } = {}): void {
    const distance = new Distance();

    const indexIndicator = (indexToDisplay: number): string => {
        if (showIndex) {
            return `[${indexToDisplay.toString().padStart(2)}] `;
        }
        return '';
    };

    let index = 0;
    let out = 'latitude,longitude,distance\n';
    for (; index < steps.nrOfCoordinates - 1; index++) {
        // tslint:disable-next-line:no-console
        out +=
            indexIndicator(index) +
            `${steps.coordinates[index].latitude}, ` +
            `${steps.coordinates[index].longitude}, ` +
            `${distance.distance(steps.coordinates[index], steps.coordinates[index + 1])}\n`;
    }
    out +=
        indexIndicator(index) +
        `${steps.coordinates[index].latitude}, ` +
        `${steps.coordinates[index].longitude}, ` +
        `0\n`;

    // tslint:disable-next-line:no-console
    console.log(`\n${out}`);

    // logger.info(`${steps.last.latitude}, ${steps.last.longitude}, 0`);
}
