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

let cssLoaderConfig = {
  module: {
    rules: [{
      test: /\.css$/,
      include: /src/,
      use: [
        config.env === 'development' ?
        styleLoader :
        MiniCssExtractPlugin.loader,
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
        }
      ]
    }]
  },
  plugins: []
}

// 打包抽离css
if (config.env !== 'development') {
  cssLoaderConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  )
}

module.exports = cssLoaderConfig