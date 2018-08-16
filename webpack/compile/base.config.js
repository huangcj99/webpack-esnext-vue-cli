// 以函数的形式创建新的base对象，避免缓存
const createBaseConfig = () => {
  return {
    mode: process.env.NODE_ENV,
    devtool: false,
    plugins: []
  }
}

module.exports = createBaseConfig