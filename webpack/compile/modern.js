const path = require('path')
const webpackMerge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin');
const { createWebpackCompile } = require('../utils/create-webpack-compile')
const { configBabelLoader } = require('../utils/config-babel-loader')
const configSplitChunk = require('../utils/config-split-chunk')
const { getEntry } = require('../utils/get-entries')
const createBaseConfig = require('./base.config')

// 获取js与html入口
let entries = getEntry('./src/pages/**/!(*legacy).js')
let baseConfig = createBaseConfig()

// es6
let modernConfig = webpackMerge({}, baseConfig, {
  entry: entries,
  output: {
    path: path.resolve(process.cwd(), './public'),
    filename: '[name].modern.[chunkhash].js',
    chunkFilename: '[name].modern.[chunkhash].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      // 排除掉不支持<script type="module">的浏览器
      configBabelLoader([
        'last 2 Chrome versions', 'not Chrome < 60',
        'last 2 Safari versions', 'not Safari < 10.1',
        'last 2 iOS versions', 'not iOS < 10.3',
        'last 2 Firefox versions', 'not Firefox < 54',
        'last 2 Edge versions', 'not Edge < 15',
      ])
    ]
  },
  plugins: [
    // 输出资源表
    new ManifestPlugin({
      fileName: 'modern-assets-manifest.json'
    })
  ],
  optimization: {
    splitChunks: configSplitChunk('modern')
  }
})

module.exports = () => {
  // 
  modernConfig.plugins.push(
    
  )

  return createWebpackCompile(modernConfig)
}