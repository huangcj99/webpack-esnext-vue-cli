const fs = require('fs-extra')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const Notifier = require('node-notifier')
const { configBabelLoader } = require('./utils/config-babel-loader')
const { getHtmlPlugins } = require('./utils/config-html-plugin')
const { createWebpackCompile } = require('./utils/create-webpack-compile')
const shouldCreateNewDll = require('./utils/should-create-new-dll')

const dllConfig = require('./dll.config')
const config = require('./config/project.config')
const htmlPlugins = getHtmlPlugins(config.htmlEntries, config.modernEntries)


const developmentConfig = {
  devtool: '#cheap-module-eval-source-map',
  mode: config.env,
  entry: config.modernEntries,
  output: {
    path: config.outputPath,
    filename: config.development.filename,
    chunkFilename: config.development.chunkFilename,
    publicPath: config.publicPath
  },
  resolve: config.resolve,
  plugins: [
    // 输出es6 chunks
    configBabelLoader([
      'last 2 Chrome versions', 'not Chrome < 60',
      'last 2 Safari versions', 'not Safari < 10.1',
      'last 2 iOS versions', 'not iOS < 10.3',
      'last 2 Firefox versions', 'not Firefox < 54',
      'last 2 Edge versions', 'not Edge < 15',
    ]),

    // 将文件同步输出到public
    new WriteFilePlugin(),

    //定义环境变量
    new webpack.DefinePlugin(config.globalVar[config.env]),

    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${config.development.host}:${config.development.port}`]
      },
      onErrors: () => {
        return (serverity, errors) => {
          const error = errors[0]
          const filename = error.file && error.file.split('!').pop

          Notifier.notify({
            title: '',
            message: serverity + ':' + error.name,
            subtitle: filename || ''
          })
        }
      }
    }),

    ...htmlPlugins,

    //给每一个入口添加打包好的vender.dll.js
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['vendor.dll.js'],
      append: false, //在body尾部的第一条引入
      hash: true
    }),

    // 注入server的脚本，自动刷新
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['webpack-dev-server.js'],
      append: true //在body尾部的第一条引入
    })
  ]
}

;(async () => {
  // 创建新的dll文件
  if (shouldCreateNewDll()) {
    await createWebpackCompile(dllConfig)
  }
  
  // 开启webpack-dev-server
  await new Promise((resolve, reject) => {
    let compiler = null
    let server = null

    // 创建compile
    compiler = webpack(developmentConfig)

    server = new WebpackDevServer(compiler, {
      host: config.development.host,
      port: config.development.port,
      contentBase: config.outputPath,
      publicPath: '/',
      quiet: true,
      proxy: config.development.proxy
    })

    server.listen(config.development.port);

    resolve()
  })
})()