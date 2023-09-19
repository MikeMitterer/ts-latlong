module.exports = {
    presets: [
        [
            // Mehr: https://babeljs.io/docs/en/babel-preset-env
            '@babel/preset-env', {
                targets: {
                    // [ 2023 09 12 ] - Es scheint noch probleme mit webapp/lib/utils/md5... zu geben

                    // When specifying this option, the browsers field will be ignored.
                    // "esmodules": true,

                    // "browsers": [
                    //     "last 2 Chrome versions",
                    //     "last 1 Safari versions",
                    //     "last 1 Firefox versions"
                    // ],
                    node: 'current',
                },
                // Enable transformation of ES6 module syntax to another module type.
                // Setting this to false will not transform modules.
                modules: 'auto'
            },
            '@babel/preset-typescript'
        ],
        '@babel/typescript'
    ],
    plugins: [
        // yarn add -D @babel/plugin-transform-runtime babel-plugin-transform-inline-environment-variables
        '@babel/plugin-transform-runtime',
        [
            'transform-inline-environment-variables',
            {
                include: ['NODE_ENV', 'REQUIRE_TARGET']
            }
        ]
    ],
    env: {
        // BABEL_ENV=node <command (e.g. yarn test:unit)>
        node: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            esmodules: true,
                            node: 'current'
                        },
                        modules: 'auto'
                    }
                ]
            ]
        }
    }
}
