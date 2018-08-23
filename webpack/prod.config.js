const webpackMerge = require('webpack-merge')
const compileModern = require('./compile/modern')
const compileLegacy = require('./compile/legacy')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const createLagacyEntries = require('./utils/create-legacy-entries')
const { renderTemplate } = require('./compile/render-template')
const { cleanAssetsManifest } = require('./utils/load-assets-manifest')
const loaderConfig = require('./loader/index.config')

const productionConfig = webpackMerge(loaderConfig, {
  mode: 'production',
  devtool: false,
  plugins: [
    // 多线程压缩
    new WebpackParallelUglifyPlugin({
      exclude: /\.min\.js$/,
      // 压缩es6的代码
      uglifyES: {
        mangle: true, // 压缩变量
        output: {
          beautify: false, // 不需要格式化
          comments: false // 不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ],
  optimization: {
    minimizer: [
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          autoprefixer: {
            disable: true
          },
          mergeLonghand: false,
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      })
    ]
  }
})

;(async () => {
  // 构建es6
  await compileModern(productionConfig)

  // 创建es5入口文件供后面构建
  await createLagacyEntries()

  // 构建es5
  await compileLegacy(productionConfig)

  // 渲染html模板，插入对应页面依赖的资源
  await renderTemplate()

  // 清理资源表
  await cleanAssetsManifest()

  console.log('Build successfully')
})()