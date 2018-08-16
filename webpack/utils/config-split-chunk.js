const splitChunk = require('../config/split-chunk.config')

const configSplitChunk = (chunkType) => {
  let realSplitChunk = {}

  for (let chunkName in splitChunk) {
    let realChunkName = `${chunkName}-${chunkType}`

    realSplitChunk[realChunkName] = Object.assign(splitChunk[chunkName], {
      name: realChunkName
    })
  }
  
  return {
    cacheGroups: realSplitChunk
  }
}

module.exports = configSplitChunk