const express = require('express')
const colors = require('colors')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const Notifier = require('node-notifier')
const { configBabelLoader } = require('./utils/config-babel-loader')
const { getHtmlPlugins } = require('./utils/config-html-plugin')
const { createWebpackCompile } = require('./utils/create-webpack-compile')
const shouldCreateNewDll = require('./utils/should-create-new-dll')
const { filterEntries } = require('./utils/get-entries')
const loaderConfig = require('./loader/index.config')

// dll config
const dllConfig = require('./dll.config')
// project config
const config = require('./config/project.config')
// html entries
const htmlPlugins = getHtmlPlugins(filterEntries(config.htmlEntries), filterEntries(config.modernEntries))
// // webpack-dev-server config
// const devServerConfig = {
//   host: config.development.host,
//   port: config.development.port,
//   contentBase: config.outputPath,
//   publicPath: '/',
//   // proxy-server
//   proxy: config.development.proxy,
//   // mock-server
//   before: shouldCreateMockServer(),
//   inline: true,
//   quiet: true,
//   stats: {
//     colors: true
//   }
// }

const developmentConfig = webpackMerge(loaderConfig, {
  devtool: '#cheap-module-eval-source-map',
  mode: 'development',
  entry: filterEntries(config.modernEntries),
  output: {
    path: config.outputPath,
    filename: config.development.filename,
    chunkFilename: config.development.chunkFilename,
    publicPath: '/'
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
    // new WriteFilePlugin(),

    //定义环境变量
    new webpack.DefinePlugin(config.globalVar[config.env]),

    new webpack.HotModuleReplacementPlugin(),

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

    // 显示进度条
    new ProgressBarPlugin()
  ]
})

;(async () => {
  // 根据依赖是否变化判断是否需要创建新的dll文件
  if (shouldCreateNewDll()) {
    await createWebpackCompile(dllConfig)
  }
  
  // 开启webpack-dev-server
  await new Promise((resolve, reject) => {
    const compiler = webpack(developmentConfig)
    const server = express()
    const devMiddleware = webpackDevMiddleware(compiler, {
      hot: true,
      publicPath: config.outputPath,
      stats: 'errors-only',
      noInfo: false
    })
    const hotMiddleware = webpackHotMiddleware(compiler)

    server.use(devMiddleware)
    server.use(hotMiddleware)
    server.use('/', express.static(config.outputPath))

    server.listen(config.development.port, () => {
      console.info(
        colors.green('==> 🌎 Open up ' + colors.yellow(`http://localhost:${config.development.port}`) + ' in your browser.')
      )
    });

    resolve()
  })
})()