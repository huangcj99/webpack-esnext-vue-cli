const webpack = require('webpack')
const md5 = require('md5')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const config = require('../config/project.config')

// 用于chunkId的碰撞校验
const chunksSet = new Set()
const chunkNameLen = 4

// 以函数的形式创建新的base对象，避免缓存
// test与production环境共用的配置
const createBaseConfig = () => {
  let baseConfig = {
    resolve: config.resolve,
    plugins: [
      // 定义环境变量
      new webpack.DefinePlugin(config.globalVar[config.env]),

      // 稳定moduleId
      // 避免引入了一个新模块后,导致模块ID变更使得vender和common的hash变化后缓存失效
      new webpack.HashedModuleIdsPlugin(),

      // 稳定chunkId
      new webpack.NamedChunksPlugin((chunk) => {
        if (chunk.name) return chunk.name

        let modules = Array.from(chunk.modulesIterable)
        let hash = md5(modules.map(m => m.id).join('_'))
        let startIdx = 0
        let chunkHashName = hash.substr(startIdx, chunkNameLen)

        while (chunksSet.has(chunkHashName)) {
          startIdx++
          chunkHashName = hash.substr(startIdx, chunkNameLen)
        }
        chunksSet.add(chunkHashName)

        return chunkHashName
      }),

      // 对代码进行作用域分析，增强tree-shaking的能力
      new WebpackDeepScopeAnalysisPlugin(),

      // 显示进度
      new ProgressBarPlugin()
    ]
  }

  return baseConfig
}

module.exports = createBaseConfig