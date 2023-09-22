// yarn add -D clean-terminal-webpack-plugin
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')

module.exports = {
    // module: {
    //     rules: [
    //         {
    //             test: /\.css$/,
    //             use: ['style-loader', 'css-loader'],
    //         },
    //     ],
    // },
    resolve: {
        fallback: {
            // "tls": false,
            // "net": false,
            // "path": false,
            // "zlib": false,
            // "http": false,
            // "https": false,
            // "stream": false,
            // "crypto": false,
            // "url": false,

            // path, crypto, stream und buffer sind in webpack.web.js konfiguriert

            //     "path": require.resolve("path-browserify"), // yarn add -D path-browserify
            //     "crypto": require.resolve("crypto-browserify"), // yarn add -D crypto-browserify
            //     "stream": require.resolve("stream-browserify"), // yarn add -D stream-browserify
            //     "https": require.resolve("https-browserify"), // yarn add -D https-browserify
            //     "http": require.resolve("stream-http"), // yarn add -D stream-http
            //     "zlib": require.resolve("browserify-zlib"), // yarn add -D browserify-zlib
            //     "assert": require.resolve("assert/"), // yarn add -D assert
            //     "url": require.resolve("url"), // yarn add -D url
            "process": require.resolve("process"), // yarn add -D process
            //     "os": require.resolve("os-browserify/browser"), // yarn add -D os-browserify
            //     "util": require.resolve("util/"), // yarn add -D util
            //     "querystring": require.resolve("querystring-es3"), // yarn add -D querystring-es3
        }
    },
    plugins: [
        // Clean Terminal before next build
        // new CleanTerminalPlugin(),

    ]
};