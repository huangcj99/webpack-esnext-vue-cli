const splitChunksConfig = {
  // 项目基础包
  vendor: {
    test: /.*test-chunk.*/g,
    name: 'vendor',
    chunks: 'all',
    enforce: true,
    priority: 10
  },
  // 自动分割
  commons: {
    name: 'commons',
    minChunks: 2,
    minSize: 0,
    chunks: 'all',
    priority: 1
  }
}

const defaultAssetsConfig = {
  chunks: [
    'manifest:inline', 
    'vendor',
    'commons'
  ]
}

module.exports = {
  splitChunksConfig,
  defaultAssetsConfig
}
