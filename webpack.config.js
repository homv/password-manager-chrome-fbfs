const path = require('path');
var webpack = require('webpack');
module.exports = {
  mode: 'development',
    plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        })
      ],
  entry: './firebase.js',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
};