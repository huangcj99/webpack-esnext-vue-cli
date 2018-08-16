const configBabelLoader = (browserlist) => {
  return {
    test: /\.js$/,
    use: {
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
    }
  }
}

module.exports = {
  configBabelLoader
}