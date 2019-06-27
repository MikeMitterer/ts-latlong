// Optionen:
//      https://github.com/smooth-code/jest-puppeteer/tree/master/packages/jest-dev-server
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

        // headless: false,
        // devtools: true

        // args: ['--lang=en-GB']
    },
}

