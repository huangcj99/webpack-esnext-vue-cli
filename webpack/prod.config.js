const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks');
const { getEntry } = require('./utils/get-entries')
const compileModern = require('./compile/modern')
const compileLegacy = require('./compile/legacy')

;(async () => {
  // 构建es6
  await compileModern()

  // 构建es5
  await compileLegacy()

  let pages = getEntry('./src/pages/**/*.html')

  let modernAssetManifest = fs.readJsonSync(path.resolve(__dirname, '../public/modern-assets-manifest.json'), {
    throws: false
  }) || {};

  let lagacyAssetManifest = fs.readJsonSync(path.resolve(__dirname, '../public/legacy-assets-manifest.json'), {
    throws: false
  }) || {};

  const env = nunjucks.configure(process.cwd(), {
    autoescape: false,
    watch: false,
  });

  env.addFilter('revision', (filename) => {
    if (lagacyAssetManifest[filename]) {
      return lagacyAssetManifest[filename]
    }

    if (modernAssetManifest[filename]) {
      return modernAssetManifest[filename]
    }
  });

  for (let htmlDir in pages) {
    (async () => {
      await fs.outputFile(path.resolve(process.cwd(), './public/' + htmlDir + '.html'), nunjucks.render(pages[htmlDir]))
    })()
  }
})()