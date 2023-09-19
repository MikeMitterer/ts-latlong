// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// Usage:
//      E2E_TEST='true' jest src/test/e2e/browser.specs.ts
const isE2ETest = process.env.E2E_TEST === 'true';

module.exports = {
    // cache: false,

    preset: 'ts-jest',
    // preset: "jest-puppeteer",


    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '^@images(.*)$': '<rootDir>/src/site/images/$1',
        '^@/(.*)$': '<rootDir>/src/main/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',

        // Config: https://jestjs.io/docs/en/webpack.html
        '.(scss)$': 'identity-obj-proxy',
    },


    // https://www.npmjs.com/package/jest-extended#setup
    "setupFilesAfterEnv": [ "jest-extended/all", './tests/jest.setup.js' ],


    // The test environment that will be used for testing
    //      https://jestjs.io/docs/en/configuration.html#testenvironment-string
    // testEnvironment: 'jsdom',
    testEnvironment: 'node',

    // Options that will be passed to the testEnvironment
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },

    // The glob patterns Jest uses to detect test files
    testMatch: [
        // Original
        // '**/src/test/**/?(*[._])+(spec|test).[jt]s?(x)',

        // Testet auch JS-Files
        // "**/src/test/**/*.[jt]s?(x)"

        // Testet nur! TS-Files
        '<rootDir>/tests/**/*.(spec|specs|test).ts?(x)',
    ],

    transform: {
        '\\.jsx?$': 'babel-jest',

        '^.+\\.js?$': 'babel-jest',

        // '^.+\\.js?$': require.resolve('babel-jest'),

        // Config: https://jestjs.io/docs/en/webpack.html
        // '.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        //     '<rootDir>/__mocks__/fileTransformer.js',
        // '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',

        '^.+\\.(ts|tsx)$': 'ts-jest',
    },

    // An array of regexp pattern strings that are matched against all source file paths,
    // matched files will skip transformation
    //
  // A MUST! if the following module is in ES6-Format!!!!
  //
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@mmit|vuetify|@mdi)/.*)'],

};

if (isE2ETest) {
    module.exports.globalSetup = 'jest-environment-puppeteer/setup';
    module.exports.globalTeardown = 'jest-environment-puppeteer/teardown';
    module.exports.testEnvironment = 'jest-environment-puppeteer';
}
