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

const renderDefaultAssets = (boundleType) => {
  let chunks = Array.from(defaultAssetsConfig.chunks)
  let boundle = {
    'modern': () => {
      let scripts = ''

      chunks.forEach((chunk) => {
        let chunkPath = chunk + '.js'
        let chunkHashPath = modernAssetManifest[chunkPath]

        // 第二条script拼接加上回车符和一个制表符，对齐输出
        if (scripts === '') {
          scripts = createModernAssetsScript(chunkHashPath)
        } else {
          scripts = `${scripts}\n\t${createModernAssetsScript(chunkHashPath)}`
        }
      })

      return scripts
    },
    'legacy': () => {
      let scripts = ''

      chunks.forEach((chunk) => {
        let chunkPath = chunk + '-legacy.js'
        let chunkHashPath = lagacyAssetManifest[chunkPath]

        // 第二条script拼接加上回车符和一个制表符，对齐输出
        if (scripts === '') {
          scripts = createLagacyAssetsScript(chunkHashPath)
        } else {
          scripts = `${scripts}\n\t${createLagacyAssetsScript(chunkHashPath)}`
        }
      })

      return scripts
    }
  }

  chunks.push(currentJsEntry)

  return boundle[boundleType]()
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
      if (!chunks) {
        return renderDefaultAssets(boundleType)
      }
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