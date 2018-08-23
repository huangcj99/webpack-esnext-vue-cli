const splitChunksConfig = {
  // 项目基础包
  'vendor': {
    test: /node_modules\/vue/g,
    name: 'vendor',
    chunks: 'all',
    enforce: true,
    priority: 2
  },
  // 单页面需要引入vue-router，这里单独分割出来
  'spa-vendor': {
    test: /node_modules\/vue-router/g,
    name: 'spa-vendor',
    chunks: 'all',
    enforce: true,
    priority: 10
  },
  // 剩余chunk自动分割
  'commons': {
    name: 'commons',
    minChunks: 2,
    minSize: 0,
    chunks: 'all',
    priority: 1
  }
}

// 入口默认加载的chunk
const defaultAssetsConfig = {
  chunks: [
    'manifest:inline', // manifest比较小，默认内联
    'vendor', 
    'commons'
  ]
}

module.exports = {
  splitChunksConfig,
  defaultAssetsConfig
}
