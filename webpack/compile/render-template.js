const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks');
const config = require('../config/project.config')
const { defaultAssetsConfig } = require('../config/split-chunk.config')
const {
  createModernAssetsScript,
  createLagacyAssetsScript,
  removeComment
} = require('../utils/assets-utils')
const {
  loadModernManifest,
  loadLagacyManifest
} = require('../utils/load-assets-manifest')

// 用于在Filter中，给入口html注入入口js
let currentJsEntry = ''
// 资源表
let modernAssetManifest = {}
let lagacyAssetManifest = {}

const renderAssets = (boundleType, chunks) => {
  let scripts = ''
  
  // 默认添加入口js
  chunks.push(currentJsEntry)

  chunks.forEach((chunk) => {
    let script = ''
    let chunkInfo = chunk.split(':')
    let param = chunkInfo[1] //是否需要内联
    let chunkPath = ''
    let chunkHashPath = ''

    if (boundleType === 'modern') {
      chunkPath = chunkInfo[0] + '.js'
      chunkHashPath = modernAssetManifest[chunkPath]
      script = createModernAssetsScript(chunkHashPath, param)
    }

    if (boundleType === 'legacy') {
      chunkPath = chunkInfo[0] + '-legacy.js'
      chunkHashPath = lagacyAssetManifest[chunkPath]
      script = createLagacyAssetsScript(chunkHashPath, param)
    }

    scripts = `${scripts}\n\t${script}`
  })

  chunks.push(currentJsEntry)

  return scripts
}

const renderTemplate = () => {
  return new Promise((resolve, reject) => {
    let htmlEntries = config.htmlEntries

    // 加载资源表
    modernAssetManifest = loadModernManifest()
    lagacyAssetManifest = loadLagacyManifest()

    // 设置项目主目录为nunjucks根路径
    const env = nunjucks.configure(process.cwd(), {
      autoescape: false // 输出html不转译
    });

    // 添加注入资源的过滤器
    env.addFilter('addAssets', (boundleType, chunks) => {
      // 没有传入对应的chunks时加载默认chunk
      if (!chunks) {
        let defaultChunks = Array.from(defaultAssetsConfig.chunks)

        return renderAssets(boundleType, defaultChunks)
      }

      return renderAssets(boundleType, chunks)
    });

    // 输出html
    for (let htmlDir in htmlEntries) {
      ;(async () => {
        let htmlOutputPath = path.resolve(process.cwd(), './public/' + htmlDir + '.html')
        let html = fs.readFileSync(htmlEntries[htmlDir]).toString()

        // 设置当前入口js路径
        currentJsEntry = htmlDir
        html = removeComment(html)

        await fs.outputFile(htmlOutputPath, nunjucks.renderString(html))
      })()
    }

    // 结束渲染
    resolve()
  })
}

module.exports = {
  renderTemplate
}