const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');
const config = require('./config/project.config')

// //从package.json中将依赖的key数组作为vender打包的列表
const vendors = Object.keys(pkg.dependencies);

module.exports = {
  mode: config.env,
  output: {
    path: path.resolve(process.cwd(), './public'),
    filename: '[name].dll.js',
    library: '[name]_[hash]',
  },
  entry: {
    "vendor": vendors,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    //输出manifest
    new webpack.DllPlugin({
      path: path.resolve(process.cwd(), './public', '[name]-manifest.json'),
      name: '[name]_[hash]'
    })
  ]
};