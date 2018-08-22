const urlLoaderConfig = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'fonts/[name].[hash].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = urlLoaderConfig