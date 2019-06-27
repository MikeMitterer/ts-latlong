const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const package = require('./package');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const date = moment().format('YYYY.MM.DD HH:mm');

// This helper function is not strictly necessary.
// I just don't like repeating the path.join a dozen times.
function srcPath(subdir) {
    return path.join(__dirname, 'src', subdir);
}

module.exports = {
    cache: devMode,
    // https://webpack.js.org/configuration/target/
    //  - default "web"
    target: 'web',

    // devServer: { port: 8080 },

    context: __dirname,

    mode: process.env.NODE_ENV || 'development',

    entry: {
        index: [path.resolve(__dirname, 'src/browser/index.ts')],

        polyfills: path.resolve(__dirname, 'src/browser/polyfills.ts'),
        mobile: path.resolve(__dirname, 'src/browser/mobile.ts'),

        // Wird per script-tag eingebunden (js/styles.js?...)
        // Es kann aber auch ein import über das index.ts-File gemacht werden
        // styles: path.resolve(__dirname, 'src/site/styles/main.scss'),
        // styles: path.resolve(__dirname, 'src/browser/_styles.ts'),
    },

    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        pathinfo: true,
    },

    // Mehr: https://webpack.js.org/configuration/devtool/#devtool
    // devtool: devMode ? 'eval' : false,
    // devtool: devMode ? 'inline-source-map' : false,
    // devtool: devMode ? 'cheap-eval-source-map' : false,

    // cheap-module-eval-source-map is the best option
    devtool: devMode ? 'cheap-module-eval-source-map' : false,

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        alias: {
            '@main': srcPath('main'),
            '@test': srcPath('test'),
            '@images': srcPath('site/images'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
            },
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
            // { test: /\.tsx?$/, use: [{ loader: 'babel-loader'}, { loader: 'ts-loader',
            //      options: {
            //          configFile: path.resolve(__dirname, 'tsconfig.lib.json'),
            //          compilerOptions: {
            //              incremental: true,
            //          },
            // }}], exclude: /node_modules/ },

            // Speed: ~750ms
            // { test: /\.tsx?$/, loader: 'ts-loader',
            //      options: {
            //          configFile: path.resolve(__dirname, 'tsconfig.lib.json')
            // }},

            // Speed: ~400ms
            { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: [ /node_modules/ ]},

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

            // {
            //       // Include ts, tsx, js, and jsx files.
            //       test: /\.(ts|js)x?$/,
            //       exclude: /node_modules/,
            //       loader: 'babel-loader',
            // },

            // {
            //     test: require.resolve("js/index.js"),
            //     use: [
            //         {
            //             loader: `expose-loader`,
            //             options: 'sayMyName'
            //         }
            //     ]
            // },
            {
                test: /\.scss$/,
                use: [
                    // creates style nodes from JS strings
                    // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,

                    devMode
                        ? 'style-loader'
                        : {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                  publicPath: '../',
                              },
                          },
                    {
                        // translates CSS into CommonJS
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        // Autoprefixer usw.
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                        },
                    },
                    {
                        // compiles Sass to CSS, using Node Sass by default
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        // https://github.com/webpack-contrib/url-loader
                        loader: 'url-loader',
                        options: {
                            // if less than 8 kb, add base64 encoded image to css
                            limit: 8192,

                            // if more than 8 kb move to this folder in build using file-loader
                            name: 'images/[name]-[hash:8].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        // clean dist folder
        new CleanWebpackPlugin(),

        // Weitere Infos: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // load `moment/locale/en.js` and `moment/locale/de.js`
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de/),

        // new ExtractTextPlugin({
        //     filename: "[name].css"
        // }),

        new CopyWebpackPlugin([{ from: 'src/site/images/static', to: 'images/static' }]),

        // Multiple HTML-Pages
        //  https://extri.co/2017/07/11/generating-multiple-html-pages-with-htmlwebpackplugin/
        new HtmlWebpackPlugin({
            filename: 'index.html',
            templateParameters: {
                version: package.version,
                devmode: devMode,
                published: date,
            },
            hash: true,
            // Weitere Infos: https://goo.gl/wVG6wx
            template: path.resolve(__dirname, 'src/site/index.ejs'),

            // Variablen funktionieren nicht
            // template: '!!html-loader?interpolate!src/web/index.ejs',
            favicon: path.resolve(__dirname, 'src/site/images/favicon.ico'),
            chunks: devMode
                ? ['polyfills', 'mobile', 'index', 'styles']
                : ['polyfills', 'mobile', 'index'],
        }),

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? 'styles/[name].css' : 'styles/[name].[contenthash].css',
            chunkFilename: devMode ? 'styles/[id].css' : 'styles/[id].[contenthash].css',
        }),

        new HtmlBeautifyPlugin({
            config: {
                html: {
                    end_with_newline: true,
                    indent_size: 4,
                    indent_with_tabs: true,
                    indent_inner_html: true,
                    preserve_newlines: false,
                    unformatted: ['p', 'i', 'b', 'span'],
                },
            },
            replace: [' type="text/javascript"'],
        }),

        new LiveReloadPlugin(),
    ],

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
};

// Reminder!
// if (devMode) {
//     module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
// }

if (!devMode) {
    // Mega-Hack! der public Path wird nachträglich gesetzt
    // test: /\.scss$/ scheint die 4-te Regel zu sein
    // module.exports.module.rules[4].use[0].options = { publicPath: '../' };
}
