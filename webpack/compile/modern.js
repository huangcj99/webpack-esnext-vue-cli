const webpackMerge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin');
const { createWebpackCompile } = require('../utils/create-webpack-compile')
const { configBabelLoader } = require('../utils/config-babel-loader')
const { filterEntries } = require('../utils/get-entries')
const configSplitChunk = require('../utils/config-split-chunk')
const createBaseConfig = require('./base.config')

let config = require('../config/project.config')
let baseConfig = createBaseConfig()

// es6
let modernConfig = webpackMerge({}, baseConfig, {
  output: {
    path: config.outputPath,
    filename: config.modernFileName,
    chunkFilename: config.modernChunkFileName,
    publicPath: config.publicPath
  },
  plugins: [
    // 排除掉不支持<script type="module">的浏览器
    configBabelLoader([
      'last 2 Chrome versions', 'not Chrome < 60',
      'last 2 Safari versions', 'not Safari < 10.1',
      'last 2 iOS versions', 'not iOS < 10.3',
      'last 2 Firefox versions', 'not Firefox < 54',
      'last 2 Edge versions', 'not Edge < 15',
    ]),

    // 输出资源表
    new ManifestPlugin({
      fileName: 'modern-assets-manifest.json'
    })
  ],
  optimization: {
    splitChunks: configSplitChunk('modern'),
    runtimeChunk: {
      name: 'manifest'
    }
  }
})

module.exports = (prodConfig) => {
  realModernConfig = webpackMerge(modernConfig, prodConfig, {
    entry: filterEntries(config.modernEntries)
  })

  return createWebpackCompile(realModernConfig)
}