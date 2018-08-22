const fs = require('fs-extra')
const path = require('path')
const config = require('../config/project.config')

const createLegacyEntries = () => {
  return new Promise((resolve, reject) => {
    // 遍历modern入口js，创建legacy入口
    for (let entry in config.modernEntries) {
      let entryPath = config.modernEntries[entry]
      let lagacyEntry = entryPath.slice(0, -3) + '-legacy.js'
      let legacyPath = path.resolve(process.cwd(), lagacyEntry)
      let fileExists = fs.pathExistsSync(legacyPath)

      // 不存在则创建legacy入口
      if (!fileExists) {
        let tmp = entryPath.split('/')
        let modernFileName = tmp[tmp.length - 1]

        fs.outputFileSync(legacyPath, `import './${modernFileName}'`)
      }
    }

    resolve()
  })
}

module.exports = createLegacyEntries