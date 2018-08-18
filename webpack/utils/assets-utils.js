// 创建es6语法boundles
const createModernAssetsScript = (assetPath) => {
  return `<script type="module" src="${assetPath}"></script>`
}

// 创建es5语法boundles
const createLagacyAssetsScript = (assetPath) => {
  return `<script nomodule src="${assetPath}"></script>`
}

// 将注释后的模板语法替换成注释内内容，用于后期nunjucks过滤器渲染资源路径
const removeComment = (html) => {
  return html.replace(/<!--(\s?)({{.*}})(\s?)-->/g, '$2')
}

module.exports = {
  createModernAssetsScript,
  createLagacyAssetsScript,
  removeComment
}