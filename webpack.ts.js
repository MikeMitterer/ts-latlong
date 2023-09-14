const path = require('path');

const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pkg = require('./package.json');
// const webpack = require('webpack');

const devMode = (process.env.NODE_ENV !== 'production');

// This helper function is not strictly necessary.
// I just don't like repeating the path.join a dozen times.
function srcPath(subdir) {
    return path.join(__dirname, 'src', subdir);
}

process.env.REQUIRE_TARGET = 'browser';

module.exports = {
    // https://webpack.js.org/configuration/target/
    //  - default "web"
    //  - target: 'node',

    mode: process.env.NODE_ENV || 'development',

    entry: {
        app: [path.resolve(__dirname, 'src/main/index.ts')],
    },

    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.js',
        // library: pkg.name.replace(/@mmit\//,''),
        library: pkg.name,
        libraryTarget: "umd",
        // umdNamedDefine: true,
        pathinfo: true,
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]'
    },

    // Mehr: https://webpack.js.org/configuration/devtool/#devtool
    // devtool: devMode ? 'eval' : false,
    // devtool: devMode ? 'inline-source-map' : false,
    // devtool: devMode ? 'inline-module-source-map' : false,
    // devtool: devMode ? 'cheap-eval-source-map' : false,

    // cheap-module-eval-source-map is the best option
    devtool: devMode ? 'source-map' : false,

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@main': srcPath('main'),
            '@test': srcPath('test'),
            '@images': srcPath('site/images'),
        },
    },

    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     enforce: 'pre',
            //     loader: 'tslint-loader',
            // },
            // {
            //     test: /\.ts?$/,
            //     // Hat probleme beim export (funkt nur einmal - dann ist Restart notwendig)
            //     // loader: 'ts-loader'
            //     loader: 'awesome-typescript-loader'
            // },

            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            // Speed: ~3000ms (https://github.com/s-panferov/awesome-typescript-loader#loader-options)
            // { test: /\.tsx?$/, loader: 'awesome-typescript-loader',
            //     options: {
            //         configFileName: path.resolve(__dirname, 'tsconfig.lib.json'),
            //         useBabel: true,
            //         babelCore: "@babel/core", // needed for Babel v7
            // }},

            // Speed: ~1000ms
            {
                test: /\.tsx?$/, use: [{loader: 'babel-loader'}, {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.lib.json'),
                        compilerOptions: {
                            "rootDir": "./src/main",
                            "sourceMap": true,
                        },
                    }
                }], exclude: /node_modules/
            },

            // Speed: ~750ms
            // { test: /\.tsx?$/, loader: 'ts-loader',
            //      options: {
            //          configFile: path.resolve(__dirname, 'tsconfig.lib.json'),
            //          compilerOptions: {
            //              incremental: true,
            //              "rootDir": "./src/main",
            //              "sourceMap": true,
            //          },
            // }},

            // Speed: ~400ms
            // { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: [ /node_modules/ ]},

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},

        ],
    },
    plugins: [
        // clean folders
        new CleanWebpackPlugin(),

        // https://webpack.js.org/plugins/source-map-dev-tool-plugin/
        // new webpack.SourceMapDevToolPlugin( {
        //    filename: 'index.js.map',
        //    exclude: ['vendor.js']
        // }),
    ],
    stats: {
        colors: true,
    },
    // https://webpack.js.org/configuration/externals/
    // externals: [ nodeExternals() ],
};
