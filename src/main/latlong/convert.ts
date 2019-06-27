/**
 * Helps with latitude / longitude calculations.
 *
 * For distance calculations the default algorithm [Vincenty] is used.
 * [Vincenty] is a bit slower than [Haversine] but fare more accurate!
 *
 *      final Distance distance = new Distance();
 *
 *      // km = 423
 *      final int km = distance.as(LengthUnit.Kilometer,
 *         new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
 *
 *      // meter = 422592
 *      final int meter = distance(new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
 *
 * Find more infos on [Movable Type Scripts](http://www.movable-type.co.uk/scripts/latlong.html)
 * and [Movable Type Scripts - Vincenty](http://www.movable-type.co.uk/scripts/latlong-vincenty.html)
 *
 * ![LatLong](http://eogn.com/images/newsletter/2014/Latitude-and-longitude.png)
 *
 * ![Map](http://www.isobudgets.com/wp-content/uploads/2014/03/latitude-longitude.jpg)
 *
 */

/** Equator radius in meter (WGS84 ellipsoid) */
export const EQUATOR_RADIUS = 6378137.0;

/** Polar radius in meter (WGS84 ellipsoid) */
export const POLAR_RADIUS = 6356752.314245;

/** WGS84 */
export const FLATTENING = 1 / 298.257223563;

/** Earth radius in meter */
export const EARTH_RADIUS = EQUATOR_RADIUS;

/** Converts degree to radian */
export function degToRadian(deg: number): number {
    return deg * (Math.PI / 180.0);
}

/** Radian to degree */
export function radianToDeg(rad: number): number {
    return rad * (180.0 / Math.PI);
}

/** Rounds [value] to given number of [decimals] */
export function round(value: number, { decimals = 6 }): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Convert a bearing to be within the 0 to +360 degrees range.
 * Compass bearing is in the rangen 0° ... 360°
 *
 * @param final
 */
export function normalizeBearing(bearing: number): number {
    return (bearing + 360) % 360;
}

/**
 * Converts a decimal coordinate value to sexagesimal format
 *
 *     final String sexa1 = decimal2sexagesimal(51.519475);
 *     expect(sexa1, '51° 31\' 10.11"');
 */
export function decimal2sexagesimal(dec: number): string {
    const _split = (value: number): [number, number] => {
        // NumberFormat is necessary to create digit after comma if the value
        // has no decimal point (only necessary for browser)
        const tmp: string[] = round(value, { decimals: 10 })
            .toFixed(10)
            .split('.');
        return [Math.abs(parseInt(tmp[0], 10)), parseInt(tmp[1], 10)];
    };

    const [deg, fractionalPart] = _split(dec);
    const min = parseFloat(`0.${fractionalPart}`) * 60;

    const [_, minFractionalPart] = _split(min);

    const sec = parseFloat(`0.${minFractionalPart}`) * 60;

    return `${deg}° ${Math.floor(min)}' ${round(sec, { decimals: 2 }).toFixed(2)}"`;
}
