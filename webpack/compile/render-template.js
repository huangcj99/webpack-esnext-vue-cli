const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks');
const config = require('../config/project.config')

const modernAssetManifestPath = path.resolve(process.cwd(), './public/legacy-assets-manifest.json')
const legacyAssetManifestPath = path.resolve(process.cwd(), './public/legacy-assets-manifest.json')

const createModernAssetsScript = (assetPath) => {
  return `<script type="module" src="${assetPath}"></script>`
}

const createLagacyAssetsScript = (assetPath) => {
  return `<script nomodule src="${assetPath}"></script>`
}

const renderTemplate = () => {
  return new Promise((resolve, reject) => {
    // 获取入口js的模板html
    let pages = config.htmlEntries
    let modernAssetManifest = fs.readJsonSync(modernAssetManifestPath, {
      throws: false
    }) || {}
    let lagacyAssetManifest = fs.readJsonSync(legacyAssetManifestPath, {
      throws: false
    }) || {};

    // 设置项目主目录为nunjucks根路径
    const env = nunjucks.configure(process.cwd(), {
      autoescape: false // 输出html不转译
    });

    // 添加注入资源的过滤器
    env.addFilter('addAssets', (filename, boundleType) => {
      // let asset = boundleType == 'modern' ? `${filename}.js` : `${filename}-${boundleType}.js`
      // if (boundleType === 'legacy' && lagacyAssetManifest[asset]) {
      //   return lagacyAssetManifest[asset]
      // }
      // console.log('---')
      // console.log(filename)
      // console.log(boundleType)

      // if (boundleType === 'modern' && modernAssetManifest[asset]) {
      //   console.log(asset)

      //   return modernAssetManifest[asset]
      // }
    });

    // 输出html
    for (let htmlDir in pages) {
      console.log(htmlDir)
      ;(async () => {
        let html = nunjucks.render(pages[htmlDir], {
          modern: createModernAssetsScript('/a/a.js'),
          legacy: ''
        })

        await fs.outputFile(path.resolve(process.cwd(), './public/' + htmlDir + '.html'), html)
      })()
    }

    resolve()
  })
}

module.exports = {
  renderTemplate
}