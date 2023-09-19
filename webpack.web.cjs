const webpack = require('webpack')
const path = require('path')
const package = require('./package')
const datefns = require('date-fns')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin')

const LiveReloadPlugin = require('webpack-livereload-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const date = datefns.format(Date.now(), 'yyyy.MM.dd HH:mm')
const supportedLocales = ['en', 'de']

// This helper function is not strictly necessary.
// I just don't like repeating the path.join a dozen times.
function srcPath(subdir) {
    return path.join(__dirname, 'src', subdir)
}

module.exports = {
    extends: [
        path.resolve(__dirname, './webpack.web.local.cjs'),
    ],
    cache: devMode,
    // https://webpack.js.org/configuration/target/
    //  - default "web"
    target: 'web',

    devServer: {
      // port: 8080
      // hot: false,
      // liveReload: false
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    },

    context: __dirname,

    mode: process.env.NODE_ENV || 'development',

    entry: {
        index: [path.resolve(__dirname, 'src/browser/index.ts')],

        polyfills: path.resolve(__dirname, 'src/browser/polyfills.ts'),
        mobile: path.resolve(__dirname, 'src/browser/mobile.ts')

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
        hashFunction: 'xxhash64'
    },

    stats: {
        // https://webpack.js.org/configuration/stats/
        // assets: false,
        assetsSort: '!size',
        // builtAt: false,
        // moduleAssets: false,
        // children: false,
        // chunkGroups: false,
        // chunkModules: false,
        // depth: true,
        // entrypoints: false,
        excludeModules: true
    },

    // Mehr: https://webpack.js.org/configuration/devtool/#devtool
    // devtool: devMode ? 'eval' : false,
    // devtool: devMode ? 'inline-source-map' : false,
    // devtool: devMode ? 'cheap-eval-source-map' : false,

    // cheap-module-eval-source-map is the best option
    devtool: devMode ? 'inline-source-map' : false,

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        alias: {
            '@main': srcPath('main'),
            '@test': srcPath('test'),
            '@images': srcPath('site/images')

            // Wegen Sinnlosigkeit (funkt nicht) wieder gestrichen
            // '@mmit/mobicore': srcPath('main'),
            // '@main': srcPath('main'),
        },
        fallback: {
            // Can't resolve 'fs' in
            "fs": false,

            // Die auskommentierten Module können im webpack.web.local.cjs
            // wieder aktiviert werden

            // "tls": false,
            // "net": false,
            // "path": false,
            // "zlib": false,
            // "http": false,
            // "https": false,
            // "stream": false,
            // "crypto": false,
            // "url": false,

            // yarn add -D path-browserify crypto-browserify stream-browserify buffer
            "path": require.resolve("path-browserify"), // yarn add path-browserify
            "crypto": require.resolve("crypto-browserify"), // yarn add crypto-browserify
            "stream": require.resolve("stream-browserify"), // yarn add stream-browserify

            //     "path": require.resolve("path-browserify"), // yarn add path-browserify
            //     "crypto": require.resolve("crypto-browserify"), // yarn add crypto-browserify
            //     "stream": require.resolve("stream-browserify"), // yarn add stream-browserify
            //     "https": require.resolve("https-browserify"), // yarn add https-browserify
            //     "http": require.resolve("stream-http"), // yarn add stream-http
            //     "zlib": require.resolve("browserify-zlib"), // yarn add browserify-zlib
            //     "assert": require.resolve("assert/"), // yarn add assert
            //     "url": require.resolve("url"), // yarn add url
            //     "process": require.resolve("process"), // yarn add process
            //     "os": require.resolve("os-browserify/browser"), // yarn add os-browserify

            "buffer": require.resolve("buffer/") // yarn add buffer
            // Muss bei "plugins" noch angegeben werden:
            //
            // new webpack.ProvidePlugin({
            //    Buffer: ['buffer', 'Buffer'],
            //    process: 'process/browser',
            // }),
        }
    },
    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     enforce: 'pre',
            //     loader: 'tslint-loader'
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
            // (exclude: /node_modules/, am 27.2.2020 entfernt da es sonst Probleme mit
            // dem coalescing-operator aus anderen Modulen gibt)
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules\/(?!(@mmit)\/).*/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    // And replace .babelrc with babel.config.json...
                    babelrc: false
                }
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [/node_modules\/typescript-collections/]
            },

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
                                  publicPath: '../'
                              }
                          },
                    {
                        // translates CSS into CommonJS
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // Autoprefixer usw.
                        loader: 'postcss-loader'
                    },
                    {
                        // compiles Sass to CSS, using Node Sass by default
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            // {
            //     // Ist notwendig sonst kommt
            //     //      "Module parse failed: Unexpected character '' (1:0)..."
            //     test: /\.(woff|woff2|eot|ttf)$/,
            //     loader: 'url-loader?limit=100000'
            // },
            // {
            //     test: /\.(png|jpg|gif|svg)$/i,
            //     use: [
            //         {
            //             // https://github.com/webpack-contrib/url-loader
            //             loader: 'url-loader',
            //             options: {
            //                 // if less than 8 kb, add base64 encoded image to css
            //                 limit: 8192,
            //
            //                 // if more than 8 kb move to this folder in build using file-loader
            //                 name: 'images/[name]-[hash:8].[ext]'
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.ejs$/,
                use: {
                    loader: 'ejs-compiled-loader',
                    options: {
                        beautify: true,
                        htmlmin: false,
                        htmlminOptions: {
                            removeComments: true
                        }
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),

        // clean dist folder
        new CleanWebpackPlugin(),

        // Clean Terminal before next build
        // new CleanTerminalPlugin(),

        // Weitere Infos: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // load `moment/locale/en.js` and `moment/locale/de.js`
        // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de/),

        // Entfernt unnötige locales
        // Weitere Infos: https://date-fns.org/docs/webpack
        new webpack.ContextReplacementPlugin(
            /date-fns[/\\]locale$/,
            new RegExp(`(${supportedLocales.join('|')})($|\\.js$|\\/index\\.js$)`)
        ),

        // new ExtractTextPlugin({
        //     filename: "[name].css"
        // }),

        new CopyWebpackPlugin({
            patterns: [{ from: 'src/site/images/static', to: 'images/static' }]
        }),

        // Multiple HTML-Pages
        //  https://extri.co/2017/07/11/generating-multiple-html-pages-with-htmlwebpackplugin/
        new HtmlWebpackPlugin({
            filename: 'index.html',
            templateParameters: {
                version: package.version,
                devmode: devMode,
                published: date
            },
            hash: true,
            // Weitere Infos: https://goo.gl/wVG6wx
            template: path.resolve(__dirname, 'src/site/index.ejs'),

            // Variablen funktionieren nicht
            // template: '!!html-loader?interpolate!src/web/index.ejs',
            favicon: path.resolve(__dirname, 'src/site/images/favicon.ico'),
            chunks: devMode ? ['polyfills', 'mobile', 'index', 'styles'] : ['polyfills', 'mobile', 'index']
        }),


        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? 'styles/[name].css' : 'styles/[name].[contenthash].css',
            chunkFilename: devMode ? 'styles/[id].css' : 'styles/[id].[contenthash].css'
        }),

        // Options: https://www.npmjs.com/package/js-beautify#css--html
        // new BeautifyHtmlWebpackPlugin({
        //     end_with_newline: true,
        //     indent_size: 4,
        //     indent_with_tabs: true,
        //     indent_inner_html: true,
        //     preserve_newlines: false,
        //     wrap_line_length: 100,
        //     unformatted: ['i', 'b', 'span']
        // }),

        new LiveReloadPlugin()
    ],

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
}

// Reminder!
// if (devMode) {
//     module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
// }

if (!devMode) {
    // Mega-Hack! der public Path wird nachträglich gesetzt
    // test: /\.scss$/ scheint die 4-te Regel zu sein
    // module.exports.module.rules[4].use[0].options = { publicPath: '../' };
}
