const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// environment
let isProduction = (process.env.NODE_ENV === 'production');
let isDevelopment = !isProduction;

module.exports = {
  entry: "./src/index.js",
  output: {
      path: path.join(__dirname, "/dist"),
      filename: "app.bundle.js"
  },
  resolve: {
      extensions: [".js"]
  },
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.ttf$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        }
      ]
  },
  plugins: [
      new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
          template: "./src/index.html"
      })
  ],
};