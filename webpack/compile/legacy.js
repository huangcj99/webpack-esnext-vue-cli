const path = require('path')
const webpackMerge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin');
const { createWebpackCompile } = require('../utils/create-webpack-compile')
const { configBabelLoader } = require('../utils/config-babel-loader')
const configSplitChunk = require('../utils/config-split-chunk')
const { getEntry } = require('../utils/get-entries')
const createBaseConfig = require('./base.config')

// 获取js与html入口
let entries = getEntry('./src/pages/**/+(*legacy).js')
let baseConfig = createBaseConfig()

// es5
let legacyConfig = webpackMerge({}, baseConfig, {
  entry: entries,
  output: {
    path: path.resolve(process.cwd(), './public'),
    filename: '[name].legacy.[chunkhash].js',
    chunkFilename: '[name].legacy.[chunkhash].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      // 配置旧版本需要兼容的浏览器
      configBabelLoader([
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
      ])
    ]
  },
  plugins: [
    // 输出资源表
    new ManifestPlugin({
      fileName: 'legacy-assets-manifest.json'
    })
  ],
  optimization: {
    splitChunks: configSplitChunk('legacy')
  }
})

module.exports = () => {
  return createWebpackCompile(legacyConfig)
}