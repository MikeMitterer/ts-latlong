import { Description, TestFunction } from './utils';

export function testQUnit(describe: Description, test: TestFunction): void {
    describe('QUnit', (): void => {
        test('test qunit', (assert): void => {
            assert.ok(true, 'Test ob QUnit funktioniert');
        });
    });
}
