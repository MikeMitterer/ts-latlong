/**
 * ESLint für Type-Script
 *
 * Config:
 *     https://typescript-eslint.io/getting-started/#step-2-configuration
 *
 * Installation:
 *     yarn add --dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
 *
 * Update:
 *     pacakage.json:
 *         "lint": "yarn eslint src tests",
 *         "lint:fix": "yarn eslint src --fix",
 */
/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        'eslint:recommended', 'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "project": ["./tsconfig.lib.json", "./tsconfig.json"]
    },
    plugins: [
        '@typescript-eslint'
    ],
    "rules": {
        // disable the rule for all files
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "off",

        // Weitere Infos: https://stackoverflow.com/a/70131153/504184
        '@typescript-eslint/ban-ts-comment': [
            'error', { 'ts-ignore': 'allow-with-description' },
        ],
        "@typescript-eslint/no-explicit-any": "off"
    },
    "overrides": [
        {
            // enable the rule specifically for TypeScript files
            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
            "files": ["*.ts", "*.mts", "*.cts", "*.tsx"],
            "rules": {
                "@typescript-eslint/explicit-function-return-type": "error"
            }
        }
    ],
    ignorePatterns: [
        "src/index.ts",
        // "test/**/*.specs.ts",
        "lib/*",
        "tools/*",
        "webpack.*.js",
        "jest.setup.js",
        "service-worker.js",
        "*.config.js",
        "src/types/global.d.ts",
        "src/global.d.ts",
        "src/node/*"
    ],
};
