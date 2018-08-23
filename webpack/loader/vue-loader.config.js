const VueLoaderPlugin = require('vue-loader/lib/plugin')

const vueLoaderConfig = {
  module: {
    rules: [
      /* 
       * webpack@4 + vue-loader@15 使用方法
       * 新的vue-loader 不再需要在联立 css-loader之类的loader
       * 引入plugin和 loader后，在处理.vue文件后会转交其他配置的loader 处理
       */
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // Vueloader@15 需要引入Vue plugin
    new VueLoaderPlugin(),
  ]
}

module.exports = vueLoaderConfig