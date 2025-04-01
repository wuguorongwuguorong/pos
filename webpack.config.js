const express = require("express");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./app.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
    server: 'http',
  },
  plugins: [
    new TerserPlugin,
    new CopyWebpackPlugin({
      patterns:[
      { from: "views", to: "views" },
      { from: "public", to: "public" },
    ]}
  ),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader"
      },
      {
        test: /\.ejs$/,
        use: ['ejs-loader'],
      },
    ],
  },
  stats: {
    errorDetails: true, // Enable error details
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  
  return config;
};