const path = require('path')
const { getEntry } = require('../utils/get-entries')

const env = process.env.NODE_ENV

// dev/test/production config
const config = {
  // html entries
  htmlEntries: getEntry('./src/pages/**/*.html'),
  // modern entries
  modernEntries: getEntry('./src/pages/**/!(*legacy).js'),
  // lagacy entries
  legacyEntries: getEntry('./src/pages/**/+(*legacy).js'),

  // output config
  outputPath: path.resolve(process.cwd(), './public'),
  publicPath: '/',

  // modern boundles
  modernFileName: '[name].[chunkhash].js',
  modernChunkFileName: '[name].[chunkhash].chunk.js',
  // legacy boundles
  legacyFileName: '[name].legacy.[chunkhash].js',
  legacyChunkFileName: '[name].legacy.[chunkhash].chunk.js',

  // dev config
  development: {
    host: 'localhost',
    port: 9000,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    proxy: {
      '/api/**': {
        target: 'http://dev.api.jishiqi.dingdingyisheng.mobi', // 服务器地址
        changeOrigin: true
      }
    }
  },

  // global variable
  globalVar: {
    development: {
      __MODE__: JSON.stringify(env)
    },
    test: {
      __MODE__: JSON.stringify(env)
    },
    production: {
      __MODE__: JSON.stringify(env)
    }
  }
}

module.exports = config
