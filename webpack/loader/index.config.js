const webpackMerge = require('webpack-merge')
const cssLoader = require('./css-loader.config')
const sassLoader = require('./sass-loader.config')
const vueLoader = require('./vue-loader.config')
const urlLoader = require('./url-loader.config')

module.exports = webpackMerge(vueLoader, cssLoader, sassLoader, urlLoader)