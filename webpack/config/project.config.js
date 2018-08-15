const path = require('path')

// 输出路径
const outputDirPath = path.join(__dirname, '../../dist')
// 输出资源的前缀
const publicPath = '/'

// 研发/测试/线上构建配置项
const config = {
  development: {
    host: 'localhost',
    port: 9000,
    outputDir: outputDirPath,
    publicPath: publicPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    proxy: {
      '/api/**': {
        target: 'http://dev.api.jishiqi.dingdingyisheng.mobi', // 服务器地址
        changeOrigin: true
      }
    },
    vars: {
      __MODE__: JSON.stringify('development'),
      __TOKEN_KEY__: JSON.stringify('zcyc-token')
    }
  },

  test: {
    outputDir: outputDirPath,
    publicPath: publicPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  production: {
    outputDir: outputDirPath,
    publicPath: publicPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  }
}

module.exports = config[process.env.NODE_ENV]
