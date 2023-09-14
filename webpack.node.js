const path = require('path');

const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devMode = (process.env.NODE_ENV !== 'production');

// This helper function is not strictly necessary.
// I just don't like repeating the path.join a dozen times.
function srcPath(subdir) {
  return path.join(__dirname, 'src', subdir);
}

module.exports = {
  // https://webpack.js.org/configuration/target/
  //  - default "web"
  target: 'node',

  mode: process.env.NODE_ENV || 'development',

  entry: {
        app: [path.resolve(__dirname, 'src/node/index.ts')],
  },
  output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'app.js',
        pathinfo: true,
  },

  devtool: devMode ? 'inline-source-map' : false,

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
      //   test: /\.ts$/,
      //   enforce: 'pre',
      //   loader: 'tslint-loader',
      // },
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
  },
  plugins: [
    // clean folders
        new CleanWebpackPlugin(),
  ],
  stats: {
        colors: true,
  },
  // https://webpack.js.org/configuration/externals/
    externals: [nodeExternals()],
};
