const { splitChunksConfig } = require('../config/split-chunk.config')

const configSplitChunk = (chunkType) => {
  let realSplitChunk = {}

  for (let chunkName in splitChunksConfig) {
    let realChunkName = chunkName

    if (chunkType === 'legacy') {
      realChunkName = `${chunkName}-${chunkType}`
    }

    realSplitChunk[realChunkName] = Object.assign(splitChunksConfig[chunkName], {
      name: realChunkName
    })
  }
  
  return {
    cacheGroups: realSplitChunk
  }
}

module.exports = configSplitChunk