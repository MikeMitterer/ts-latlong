// Optionen:
//      https://github.com/smooth-code/jest-puppeteer/tree/master/packages/jest-dev-server
//
// yarn add -D jest-puppeteer@^9.0.0 puppeteer@^21.1.1
//     https://www.npmjs.com/package/jest-puppeteer
//     https://www.npmjs.com/package/puppeteer
//
module.exports = {
    server: {
        // 'serve' öffnet nicht automatisch einen Browser-Tab
        command: 'yarn serve --port 5000',

        // jest-puppeteer waits until this port respond before starting the tests.
        port: 5000,

        // If the port is used, stop everything
        usedPortAction: 'kill',
        
        launchTimeout: 100000,
        debug: true,
    },
    launch: {
        dumpio: true,
        // headless: process.env.HEADLESS !== 'false',

        // https://developer.chrome.com/articles/new-headless/
        headless: 'new',
        // devtools: true

        // args: ['--lang=en-GB']
    },
}

