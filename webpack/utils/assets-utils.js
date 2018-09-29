const path = require('path')
const fs = require('fs-extra')
const config = require('../config/project.config')

const outputPath = config.outputPath
const publicPath = config.publicPath

// 创建es6语法boundles
const createModernAssetsScript = (assetPath, param) => {
  //  参数为inline则将资源内联
  if (param && param === 'inline') {
    let assetOutputPath = path.join(outputPath, assetPath)
    let asset = ''

    // 将path中的publicPath替换成根路径
    assetOutputPath = assetOutputPath.replace(publicPath, '/')

    asset = fs.readFileSync(assetOutputPath).toString()
    
    return `<script type="module">${asset}</script>`
  }

  return `<script type="module" src="${assetPath}"></script>`
}

// 创建es5语法boundles（nomodule不将manifest内联）
const createLagacyAssetsScript = (assetPath, param) => {
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