import { Description, TestFunction } from './utils'
import { test as describe } from 'qunit'

function timeout(ms: number): Promise<number> {
    return new Promise((resolve): void => {
        setTimeout((): void => resolve(42), ms)
    })
}

export function testQUnit(): void {
    describe('add three numbers', (assert: Assert): void => {
        assert.equal(1 + 1 + 1, 3)
    })

    describe('Test ASYNC call', async (assert: Assert): Promise<void> => {
        const done = assert.async()

        const value = await timeout(2000)
        done()

        assert.equal(value, 42)
    })
}
