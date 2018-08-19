const path = require('path')
const fs = require('fs-extra')

let modernAssetsManifestPath = path.resolve(process.cwd(), './public/modern-assets-manifest.json')
let lagacyAssetsManifestPath = path.resolve(process.cwd(), './public/legacy-assets-manifest.json')

// 读取modern资源表
const loadModernManifest = () => {
  return fs.readJsonSync(modernAssetsManifestPath)
}

// 读取lagacy资源表
const loadLagacyManifest = () => {
  return fs.readJsonSync(lagacyAssetsManifestPath)
}

module.exports = {
  loadModernManifest,
  loadLagacyManifest
}