const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const commonConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(mp3|ogg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    open: true,
    host: 'localhost',
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'eCommerce-Application',
    }),
    new EslintPlugin({ extensions: ['ts'] }),
    new Dotenv(),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(commonConfig, envConfig);
};
