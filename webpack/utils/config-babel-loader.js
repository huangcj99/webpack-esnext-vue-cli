const os = require('os')
const HappyPack = require('happypack')

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

const configBabelLoader = (browserlist) => {
  // 多线程打包
  return new HappyPack({
    id: 'babel', // 上面loader?后面指定的id
    loaders: [{
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            modules: false,
            useBuiltIns: true,
            targets: {
              browsers: browserlist,
            },
          }],
          'stage-2'
        ],
        plugins: ['syntax-dynamic-import']
      }
    }], // 实际匹配处理的loader
    threadPool: happyThreadPool,
    verbose: true
  })
}

module.exports = {
  configBabelLoader
}