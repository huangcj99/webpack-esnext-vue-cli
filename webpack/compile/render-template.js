const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks');
const config = require('../config/project.config')
const { defaultAssetsConfig } = require('../config/split-chunk.config')
const { filterEntries } = require('../utils/get-entries')
const {
  createModernAssetsScript,
  createLagacyAssetsScript,
  removeComment
} = require('../utils/assets-utils')
const {
  loadModernManifest,
  loadLagacyManifest
} = require('../utils/load-assets-manifest')
const loadingPreRender = require('../utils/render-loading')

// 用于在Filter中，给入口html注入入口js
let currentJsEntry = ''
// 资源表
let modernAssetManifest = {}
let lagacyAssetManifest = {}
// chunk cache
let chunkCaches = {}
let commonChunks = Array.from(defaultAssetsConfig.chunks)
// Safair10 shim(解决nomodule无法识别)
let shimPath = path.resolve(process.cwd(), './src/assets/shim/nomodule-shim.html')
let shim = fs.readFileSync(shimPath).toString()

const renderLoading = (loadingAssetType) => {
  return loadingPreRender[loadingAssetType]
}

// modern与legacy抽离的css是一样的，这里直接饮用modern的css
const renderStyle = () => {
  let chunkPaths = ['commons.css']
  let styles = ''

  chunkPaths.push(currentJsEntry + '.css')

  chunkPaths.forEach((chunkPath) => {
    let style = ''
    let chunkHashPath = modernAssetManifest[chunkPath]

    if (!chunkHashPath) {
      return
    }

    style = `<link href="${chunkHashPath}" rel="stylesheet">`

    styles = `${styles}\n\t${style}`
  })

  return styles
}

const renderScript = (boundleType, chunks) => {
  let scripts = ''

  // 添加shim，解决Safair10版本不支持nomodule的问题
  if (boundleType === 'legacy') {
    scripts = shim
  }

  // 拼接资源script
  chunks.forEach((chunk) => {
    let script = ''
    let chunkInfo = chunk.split(':')
    let param = chunkInfo[1] //是否需要内联
    let chunkPath = ''
    let chunkHashPath = ''

    if (boundleType === 'modern') {
      chunkPath = chunkInfo[0] + '.js'
      chunkHashPath = modernAssetManifest[chunkPath]

      if (!chunkHashPath) {
        return
      }

      // 入口通用chunk首次读取完后加入chunkCaches中，避免频繁进行io读取
      if (commonChunks.indexOf(chunk) !== -1) {
        // 不存在缓存中则创建，并加入缓存
        if (!chunkCaches[chunkPath]) {
          script = createModernAssetsScript(chunkHashPath, param)
          chunkCaches[chunkPath] = script
        } else {
          script = chunkCaches[chunkPath]
        }
      } else {
        script = createModernAssetsScript(chunkHashPath, param)
      }
    }

    if (boundleType === 'legacy') {
      chunkPath = chunkInfo[0] + '-legacy.js'
      chunkHashPath = lagacyAssetManifest[chunkPath]

      if (!chunkHashPath) {
        return
      } 

      // 入口通用chunk首次读取完后加入chunkCaches中，避免频繁进行io读取
      if (commonChunks.indexOf(chunk) !== -1) {
        // 不存在缓存中则创建，并加入缓存
        if (!chunkCaches[chunkPath]) {
          script = createLagacyAssetsScript(chunkHashPath, param)
          chunkCaches[chunkPath] = script
        } else {
          script = chunkCaches[chunkPath]
        }
      } else {
        script = createLagacyAssetsScript(chunkHashPath, param)
      }
    }

    scripts = `${scripts}\n\t${script}`
  })

  return scripts
}

const renderTemplate = () => {
  return new Promise((resolve, reject) => {
    let htmlEntries = filterEntries(config.htmlEntries)

    // 加载资源表
    modernAssetManifest = loadModernManifest()
    lagacyAssetManifest = loadLagacyManifest()

    // 设置项目主目录为nunjucks根路径
    const env = nunjucks.configure(process.cwd(), {
      autoescape: false // 输出html不转译
    });

    // 添加注入资源的过滤器
    env.addFilter('addAssets', (assetType, chunks) => {
      if (assetType === 'loading-html') {
        return renderLoading('html')
      }

      if (assetType === 'loading-css') {
        return renderLoading('css')
      }

      // 插入css资源(commons.css与页面入口抽取的css)
      if (assetType === 'css') {
        return renderStyle()
      }

      // 默认渲染js资源
      let modernScript = ''
      let legacyScript = ''
      let renderChunks = {}

      // 没有传入对应的chunks时加载默认chunk
      if (!chunks) {
        renderChunks = Array.from(defaultAssetsConfig.chunks)
      } else {
        renderChunks = Array.from(chunks)
      }

      // 默认添加入口js
      renderChunks.push(currentJsEntry)

      modernScript = renderScript('modern', renderChunks)
      legacyScript = renderScript('legacy', renderChunks)

      return `${modernScript}\n\t${legacyScript}`
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