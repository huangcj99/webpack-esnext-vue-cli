let babelLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=babel'
      }
    ]
  }
}

module.exports = babelLoaderConfig