const path = require('path')
const glob = require('glob')

// project webpack config
const env = process.env.NODE_ENV
const includeEntries = require('../config/dev-include-entries.config')
const excludeEntries = require('../config/exclude-entries.config')

const getEntry = (globPath, exclude) => {
  const entries = {}
  let excludePaths = []
  let basename
  let tmp
  let pathname

  if (exclude) {
    exclude = (typeof exclude === 'string') ? [exclude] : exclude;
    for (let i = 0; i < exclude.length; i++) {
      excludePaths = excludePaths.concat(glob.sync(exclude[i]))
    }
  }

  glob.sync(globPath).forEach((entry) => {
    if (excludePaths.indexOf(entry) > -1) {
      return
    }

    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/')
    tmp.pop()
    tmp.shift()
    tmp.shift()
    tmp.shift()
    
    // 输出与目录名相同的js文件与包含-lagacy的js文件
    if (tmp[tmp.length - 1] === basename || tmp[tmp.length - 1] + '-legacy' === basename) {
      tmp = tmp.join('/')
      pathname = `${tmp}/${basename}` // 正确输出js和html的路径
      entries[pathname] = entry
    }

  })

  return entries
}

// 过滤入口
const filterEntries = (entries) => {
  let filterEntries = {}
  let filterPath = env === 'development' ?
    includeEntries :
    excludeEntries

  // 开发时，include entries
  if (env === 'development') {
    // 第一项为all则构建全部入口
    if (filterPath[0] === 'all') {
      return entries
    }

    // 遍历入口
    for (let key in entries) {
      // 遍历需要过滤的入口
      for (let i = 0; i < filterPath.length; i++) {
        let hasInclude = key.indexOf(filterPath[i])

        // 匹配到则加入
        if (hasInclude !== -1) {
          filterEntries[key] = entries[key]
          break
        }
      }
    }
  } else {
    // 打包（test or prod），exclude entries
    // 遍历exclude entries
    for (let i = 0; i < filterPath.length; i++) {
      // 遍历entries
      for (let key in entries) {
        let hasExclude = key.indexOf(filterPath[i])

        // 匹配到，删除入口，跳出循环
        if (hasExclude !== -1) {
          delete entries[key]
          break
        }
      }
    }

    filterEntries = entries
  }

  return filterEntries
}

module.exports = {
  getEntry,
  filterEntries
}