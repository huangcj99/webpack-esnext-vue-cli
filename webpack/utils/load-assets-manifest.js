const path = require('path')
const fs = require('fs-extra')

let assetsManifestPath = path.resolve(process.cwd(), './public/assets-manifest.json')
let assetsManifest = fs.readJsonSync(assetsManifestPath, {
  throws: false
}) || {};

module.exports = assetsManifest