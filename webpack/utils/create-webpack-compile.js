const webpack = require('webpack')

const createWebpackCompile = (config) => {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    // 开始编译
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      console.log(stats.toString({
        colors: true
      }) + '\n')

      resolve()
    })
  })
}

module.exports = {
  createWebpackCompile
}