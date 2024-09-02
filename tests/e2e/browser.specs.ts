import 'jest-extended';
import puppeteer, { Browser, Page } from 'puppeteer';

/**
 * Install:
 *      yarn add --dev jest-puppeteer
 *      yarn add --dev puppeteer
 *
 * Damit der "Compile-Prozess" vor dem Aufruf des Browsers angestoßen wird
 * muss jest wie folgt gestartet werden:
 *       export E2E_TEST='true' && jest src/test/e2e/browser.specs.ts
 *
 * Mehr:
 *      https://dev.to/aalises/dealing-with-asynchrony-when-writing-end-to-end-tests-with-puppeteer--jest-n37
 */
describe('puppeteer.ts', (): void => {
    const TEST_PORT = 5000;

    // const logger = LoggerFactory.getLogger('test.reminder.ts');

    let page: Page;
    let browser: Browser;
    const width = 1920;
    const height = 1080;

    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
    beforeEach(
        async (): Promise<void> => {
            browser = await puppeteer.launch({
                headless: false,
                // slowMo: 100,
                // args: [`--window-size=${width},${height}`],
            });
            page = await browser.newPage();
            await page.goto(`http://localhost:${TEST_PORT}/`, { waitUntil: 'networkidle0' });
            await page.setViewport({ width, height });
            // await jestPuppeteer.debug();
        },
    );

    afterEach(
        async (): Promise<void> => {
            await page.close();
            await browser.close();
        },
    );

    test('Test in Browser', async (): Promise<void> => {
        let title = await page.title();
        let timeoutCounter = 0
        while (!title.startsWith('✔') && timeoutCounter < 5) {
            await new Promise(r => setTimeout(r, 1000))

            title = await page.title();
            timeoutCounter++;
        }
        expect(title).toStartWith('✔');
    }, 100000);
});
