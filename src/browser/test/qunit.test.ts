import { Description, TestFunction } from './utils';
// import * as Qunit from 'qunit'

export function testQUnit(describe: Description, test: TestFunction): void {
    QUnit.module('QUnit', (): void => {
        test('test qunit', (assert): void => {
            assert.ok(true, 'Test ob QUnit funktioniert');
        });
    });
}
