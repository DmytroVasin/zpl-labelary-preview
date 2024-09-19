'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const config = {
  target: 'node',
  entry: './lib/extension.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: 'source-map',
  externals: {
    vscode: "commonjs vscode"
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/@vscode-elements/elements/dist/bundled.js'),
          to: path.resolve(__dirname, 'dist', 'modules')
        },
        {
          from: path.resolve(__dirname, 'node_modules/highlight.js/styles/atom-one-dark.css'),
          to: path.resolve(__dirname, 'dist', 'modules')
        },
        {
          from: path.resolve(__dirname, 'lib/index.js'),
          to: path.resolve(__dirname, 'dist', 'modules')
        },
        {
          from: path.resolve(__dirname, 'lib/index.css'),
          to: path.resolve(__dirname, 'dist', 'modules')
        }
      ]
    })
  ]
}

module.exports = config;
