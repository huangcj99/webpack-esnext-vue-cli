const createWebpackCompile = (config) => {
  const compiler = webpack(config)

  return () => {
    return new Promise((resolve, reject) => {
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
}

module.exports = {
  createWebpackCompile
}