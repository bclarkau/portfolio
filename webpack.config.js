const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
          test: /\.(ttf)$/,
          exclude: [
            path.resolve(__dirname, './node_modules'),
          ],
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        },
      ]
  },
  plugins: [
      new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
          template: "./src/index.html"
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/img/*', to: path.resolve(__dirname, './dist/img/[name][ext]') },
          { from: 'src/img/favicon/*', to({ context, absoluteFilename }) {
            return "[name][ext]";
          } }
        ]
      }),
  ],
};