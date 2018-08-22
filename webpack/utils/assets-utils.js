const path = require('path')
const fs = require('fs-extra')
const config = require('../config/project.config')

const publicPath = config.outputPath

// 创建es6语法boundles
const createModernAssetsScript = (assetPath, param) => {
  //  参数为inline则将资源内联
  if (param && param === 'inline') {
    let assetoutputPath = path.join(publicPath, assetPath)

    let asset = fs.readFileSync(assetoutputPath).toString()
    return `<script type="module">${asset}</script>`
  }

  return `<script type="module" src="${assetPath}"></script>`
}

// 创建es5语法boundles（nomodule不将manifest内联）
const createLagacyAssetsScript = (assetPath, param) => {
  // //  参数为inline则将资源内联
  // if (param && param === 'inline') {
  //   let assetoutputPath = path.join(publicPath, assetPath)
  //   let asset = fs.readFileSync(assetoutputPath).toString()

  //   return `<script nomodule>${asset}</script>`
  // }

  return `<script nomodule src="${assetPath}"></script>`
}

// 将注释后的模板语法替换成注释内内容，用于后期nunjucks过滤器渲染资源路径
const removeComment = (html) => {
  return html.replace(/<!--(\s?)({.*})(\s?)-->/g, '$2')
}

module.exports = {
  createModernAssetsScript,
  createLagacyAssetsScript,
  removeComment
}