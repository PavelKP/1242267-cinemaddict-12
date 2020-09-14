const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js',  // magic hack to put bundle.js in public/js/ directory
    path: path.join(__dirname, 'public'),
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
  },
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin()
  ]
};
