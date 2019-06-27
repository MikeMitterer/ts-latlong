import { Description, TestFunction } from './utils';

export function testQUnit(describe: Description, test: TestFunction): void {
    describe('QUnit', () => {
        test('test qunit', (assert) => {
            assert.ok(true, 'Test ob QUnit funktioniert');
        });
    });
}
