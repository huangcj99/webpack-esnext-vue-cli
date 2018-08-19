const HtmlWebpackPlugin = require('html-webpack-plugin')

const getHtmlPlugins = (pages, entries) => {
  const confs = []

  for (let pathname in pages) {

    if (Object.prototype.hasOwnProperty.call(pages, pathname)) {
      // 配置生成的html文件，定义路径等
      let conf = {
        filename: `${pathname}.html`,
        template: pages[pathname], // 模板路径
        minify: {
          removeComments: false, //移除HTML中的注释
          collapseWhitespace: false, //折叠空白区域 也就是压缩代码
          removeAttributeQuotes: false, //去除属性引用
        },
        inject: true, // js插入位置
        chunks: [] // 依赖插入顺序
      }

      if (pathname in entries) {
        conf.chunks.push(pathname);
      }

      confs.push(new HtmlWebpackPlugin(conf))
    }
  }

  return confs
}

module.exports = {
  getHtmlPlugins
}