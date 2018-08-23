const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssConfig = require('../config/postcss.config')
const config = require('../config/project.config')

const openSourceMap = config.env !== 'production' ? true : false
const styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: openSourceMap
  }
}

let sassLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.scss/,
        exclude: /node_modules/,
        use: [
          config.env === 'development'
            ? styleLoader
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: openSourceMap
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: openSourceMap,
              ident: 'postcss',
              plugins: postcssConfig
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: openSourceMap
            }
          },
          {
            // 在vue文件中不需要@import来引入scss文件就可使用mixin.scss中的全局变量与mixin
            loader: 'sass-resources-loader',
            options: {
              sourceMap: openSourceMap,
              resources: [
                resolve(process.cwd(), './src/assets/scss/mixin.scss'),
                resolve(process.cwd(), './src/assets/scss/svg.scss')
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: []
}

// 打包抽离css
if (config.env !== 'development') {
  sassLoaderConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  )
}

module.exports = sassLoaderConfig