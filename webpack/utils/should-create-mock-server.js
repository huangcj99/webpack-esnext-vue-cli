const { resolve } = require('path')
const mockMiddleware = require('../../mock/index')

// 环境变量MOCK为true则开启mock-server
const shouldCreateMockServer = () => {
  let open = false

  // 查看是否存在--mock参数，若有则开启mock服务器
  if (process.env.MOCK) {
    open = true
  }

  return open
  ? function (app) {
    mockMiddleware(resolve(process.cwd(), './mock/config.js'), app)
  }
  : function () {}
}

module.exports = shouldCreateMockServer