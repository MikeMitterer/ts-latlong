import { test} from '@mmit/muni'
import { expect } from 'chai'

function timeout(ms: number): Promise<number> {
    return new Promise((resolve): void => {
        setTimeout((): void => resolve(42), ms)
    })
}

export async function testMUnit(): Promise<void> {
    await test('add three numbers', async (): Promise<void> => {
        expect(1 + 1 + 1).to.be.equal(3)
    })

    await test('Test ASYNC call', async (): Promise<void> => {

        const value = await timeout(2000)
        expect(value).to.be.equal(42)
    })
}
