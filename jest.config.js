// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// Usage:
//      E2E_TEST='true' jest src/test/e2e/browser.specs.ts
const isE2ETest = process.env.E2E_TEST === 'true';

module.exports = {
    preset: "ts-jest",
    // preset: "jest-puppeteer",

    // All imported modules in your tests should be mocked automatically
    // automock: false,

    // Stop running tests after the first failure
    // bail: false,

    // Respect "browser" field in package.json when resolving modules
    // browser: false,

    // The directory where Jest should store its cached dependency information
    // cacheDirectory: "/var/folders/m4/9rg16xhd2rlbln753n9zk1540000gn/T/jest_dx",

    // Automatically clear mock calls and instances between every test
    // clearMocks: false,

    // Indicates whether the coverage information should be collected while executing the test
    // collectCoverage: false,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // collectCoverageFrom: null,

    // The directory where Jest should output its coverage files
    // coverageDirectory: null,

    // An array of regexp pattern strings used to skip coverage collection
    // coveragePathIgnorePatterns: [
    //   "/node_modules/"
    // ],

    // A list of reporter names that Jest uses when writing coverage reports
    // coverageReporters: [
    //   "json",
    //   "text",
    //   "lcov",
    //   "clover"
    // ],

    // An object that configures minimum threshold enforcement for coverage results
    // coverageThreshold: null,

    // Make calling deprecated APIs throw helpful error messages
    // errorOnDeprecated: false,

    // Force coverage collection from ignored files usin a array of glob patterns
    // forceCoverageMatch: [],

    // A path to a module which exports an async function that is triggered once before all test suites
    // globalSetup: null,

    // A path to a module which exports an async function that is triggered once after all test suites
    // globalTeardown: null,

    // A set of global variables that need to be available in all test environments
    // globals: {},

    // An array of directory names to be searched recursively up from the requiring module's location
    // moduleDirectories: [
    //   "node_modules"
    // ],

    // An array of file extensions your modules use
    // moduleFileExtensions: [
    //   "js",
    //   "json",
    //   "jsx",
    //   "node"
    // ],

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^@images(.*)$": "<rootDir>/src/site/images/$1",
        "^@main(.*)$": "<rootDir>/src/main/$1",

        // Config: https://jestjs.io/docs/en/webpack.html
        ".(scss)$": "identity-obj-proxy",
    },

    // An array of regexp pattern strings, matched against all module paths
    // before considered 'visible' to the module loader
    // modulePathIgnorePatterns: [],

    // Activates notifications for test results
    // notify: false,

    // An enum that specifies notification mode. Requires { notify: true }
    // notifyMode: "always",

    // A preset that is used as a base for Jest's configuration
    // preset: null,

    // Run tests from one or more projects
    // projects: null,

    // Use this configuration option to add custom reporters to Jest
    // reporters: undefined,

    // Automatically reset mock state between every test
    // resetMocks: false,

    // Reset the module registry before running each individual test
    // resetModules: false,

    // A path to a custom resolver
    // resolver: null,

    // Automatically restore mock state between every test
    // restoreMocks: false,

    // The root directory that Jest should scan for tests and modules within
    // rootDir: null,

    // A list of paths to directories that Jest should use to search for files in
    // roots: [
    //   "<rootDir>"
    // ],

    // Allows you to use a custom runner instead of Jest's default test runner
    // runner: "jest-runner",

    // The paths to modules that run some code to configure or set up the testing environment before each test
    // setupFiles: [],

    // The path to a module that runs some code to configure or set up the testing framework before each test
    // setupTestFrameworkScriptFile: null,

    // https://www.npmjs.com/package/jest-extended#setup
    "setupFilesAfterEnv": [ 'jest-extended/all' ],

    // A list of paths to snapshot serializer modules Jest should use for snapshot testing
    // snapshotSerializers: [],

    // The test environment that will be used for testing
    //      https://jestjs.io/docs/en/configuration.html#testenvironment-string
    // testEnvironment: 'jsdom',
    testEnvironment: 'node',

    // Options that will be passed to the testEnvironment
    // testEnvironmentOptions: {},

    // Adds a location field to test results
    // testLocationInResults: false,

    // The glob patterns Jest uses to detect test files
    testMatch: [
        // Original
        // '**/src/test/**/?(*[._])+(spec|test).[jt]s?(x)',

        // Testet auch JS-Files
        // "**/src/test/**/*.[jt]s?(x)"

        // Testet nur! TS-Files
        '<rootDir>/src/test/**/*.(spec|specs|test).ts?(x)',
    ],

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    // testPathIgnorePatterns: [
    //   "/node_modules/"
    // ],

    // The regexp pattern Jest uses to detect test files
    // testRegex: "",

    // This option allows the use of a custom results processor
    // testResultsProcessor: null,

    // This option allows use of a custom test runner
    // testRunner: "jasmine2",

    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    // testURL: "http://localhost",

    // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
    // timers: "real",

    // A map from regular expressions to paths to transformers
    // transform: null,
    transform: {
        '\\.jsx?$': 'babel-jest',

        // Config: https://jestjs.io/docs/en/webpack.html
        ".(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/__mocks__/fileTransformer.js",

        "^.+\\.(ts|tsx)$": "./node_modules/ts-jest",
    },

    // An array of regexp pattern strings that are matched against all source file paths,
    // matched files will skip transformation
    //
    // UNBEDINGT Notwendig für ES6 module!!!!
    //
    // transformIgnorePatterns: [
    //      "<rootDir>/node_modules/(?!@mmit\/communication)"
    // ],

    // An array of regexp pattern strings that are matched against all
    // modules before the module loader will automatically return a mock for them
    // unmockedModulePathPatterns: undefined,

    // Indicates whether each individual test should be reported during the run
    // verbose: null,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    // watchPathIgnorePatterns: [],

    // Whether to use watchman for file crawling
    // watchman: true,
};

if(isE2ETest) {
    module.exports.globalSetup = "jest-environment-puppeteer/setup";
    module.exports.globalTeardown = "jest-environment-puppeteer/teardown";
    module.exports.testEnvironment = "jest-environment-puppeteer";
}
