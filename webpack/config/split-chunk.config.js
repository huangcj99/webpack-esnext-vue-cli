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
  common: {
    name: 'common',
    minChunks: 5,
    chunks: 'all',
    priority: 1
  }
}

const defaultAssetsConfig = {
  inlineAssets: ['manifest'],
  chunks: ['manifest', 'vendor']
}

module.exports = {
  splitChunksConfig,
  defaultAssetsConfig
}
