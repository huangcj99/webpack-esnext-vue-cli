const postcssConfig = [
  /**
   * 可以用于绘制固定比例的容器
   * demo: src/test/components/test-aspect-ratio.vue
   */
  require("postcss-aspect-ratio-mini")(),
  /**
   * 解决移动端1px线变粗的问题， 不支持圆角， 圆角可以用transform和伪类实现
   * demo: src/test/components/test-svg.vue
   */
  require("postcss-write-svg")({
    utf8: false
  }),
  /**
   * viewportWidth: 375,  // 设计图尺寸
   * unitPrecision: 3,  // 指定`px`转换为视窗单位值的小数位数
   * selectorBlackList: [],  // 需要匹配某一些类或者标签不进行vw的转换
   * minPixelValue: 1  // 小于或等于`1px`不转换为视窗单位
   */
  require('postcss-px-to-viewport')({
     viewportWidth: 375,
     unitPrecision: 3,
     selectorBlackList: ['.ignore'],
     minPixelValue: 1
  }),
  /**
   * browsersList在package.json中设置即可
   */
  require('autoprefixer')({
    browsers: [
      '> 1%',
      'last 2 versions',
      'Firefox ESR',
    ]
  })
]

module.exports = postcssConfig
