module.exports = {
    "presets": [
        // [
        //     // Mehr: https://babeljs.io/docs/en/babel-preset-env
        //     "@babel/preset-env",
        //     {
        //         "targets": {
        //             // When specifying this option, the browsers field will be ignored.
        //             // "esmodules": true,
        //
        //             "node": "current",
        //             "browsers": [
        //                 "last 2 Chrome versions",
        //                 "last 1 Safari versions",
        //                 "last 1 Firefox versions"
        //             ]
        //         },
        //         // Enable transformation of ES6 module syntax to another module type.
        //         // Setting this to false will not transform modules.
        //         "modules": "auto"
        //     }
        // ],
        "@babel/typescript"
    ],
    "plugins": [
        // "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        ["transform-inline-environment-variables", {
            "include": [
                "NODE_ENV", "REQUIRE_TARGET"
            ]
        }]
    ],
    "env": {
        // BABEL_ENV=node <command (e.g. yarn test:unit)>
        "node": {
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "esmodules": true,
                            "node": "current"
                        },
                        "modules": "auto"
                    }
                ]
            ]
        }
    }
}
