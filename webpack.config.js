const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',

  entry: {
    app: path.resolve(__dirname, 'lib', 'ui', 'startup')
  },

  output: {
    path: path.resolve(__dirname, 'web'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        loader:  'babel-loader',
        options: { presets: ['@babel/preset-react'] }
      }
    ]
  }
};
