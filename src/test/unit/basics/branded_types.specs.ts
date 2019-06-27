// import 'jest-extended';
// import { loggerFactory } from '../../main/config/ConfigLog4j';

describe('branded_types', () => {
    // const logger = LoggerFactory.getLogger('test.branded.types');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    type Brand<K, T> = K & { __brand: T };

    type USD = Brand<number, 'USD'>;
    type EUR = Brand<number, 'EUR'>;

    // https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
    test('Branded number', () => {
        // tslint:disable-next-line:prefer-const
        let usd: USD = 5 as USD;

        // tslint:disable-next-line:prefer-const
        let eur: EUR = 10 as EUR;

        // Funktioniert nicht!
        // usd = eur;
        expect(usd).toBe(5);

        expect(eur).toBe(10);

        // expect(convertToEURO(usd)).toBe(6);
        // expect(convertToEURO(eur)).toBe(10);

        // expect(convertToEURO(5)).toBe(10);

        expect(thisIsATest()).toBe(100);
    });

    function thisIsATest(): number {
        // noinspection JSUnusedLocalSymbols
        // @ts-ignore
        const val = 10 * 10;
        return val;
    }

    const convertArrayToObj = (data: Array<string | string[]>): { [key: string]: string } => {
        const formattedObj: { [key: string]: string } = {};

        data.forEach((val) => {
            if (Array.isArray(val)) {
                formattedObj[val[0].trim()] = val[0].trim();
            } else {
                formattedObj[val.trim()] = val.trim();
            }
        });
        return formattedObj;
    };

    test('ArrayToObj', () => {
        const obj1 = convertArrayToObj(['A', 'B', 'C']);

        expect(obj1.A).toBe('A');

        const obj2 = convertArrayToObj([['A', 'B', 'C'], ['1', '2', '3']]);
        // tslint:disable-next-line:no-string-literal
        expect(obj2['A']).toBe('A');
        // tslint:disable-next-line:no-string-literal
        expect(obj2['B']).toBe(undefined);
        expect(obj2['1']).toBe('1');
        expect(obj2['2']).toBe(undefined);
    });

    // const convertToEURO = (value: USD | EUR): EUR => {
    //     if (isUSD(value)) {
    //         return (value * 1.2) as EUR;
    //     }
    //     return value;
    // };
    //
    // function isUSD(currency: USD | EUR): currency is USD {
    //     // return currency === USD;
    //     // @ts-ignore
    //     const str = currency.toString();
    //     return '__brand' in currency; // && currency.__brand === 'USD';
    // }
});
