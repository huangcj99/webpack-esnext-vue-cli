const path = require('path')
const glob = require('glob')

// project webpack config
const includeEntries = require('./include-entries.config')
const splitChunksConfig = require('./split-chunks.config')

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

    if (tmp[tmp.length - 1] === basename) {
      tmp = tmp.join('/')
      pathname = `${tmp}/${basename}` // 正确输出js和html的路径
      entries[pathname] = entry
    }

  })

  return entries
};

// 过滤入口
const filterEntries = (entries) => {
  if (includeEntries[0] === 'all') {
    return entries
  }

  let filterEntries = {}

  for (let key in entries) {
    for (let i = 0; i < includeEntries.length; i++) {
      let hasInclude = key.indexOf(includeEntries[i])

      if (hasInclude !== -1) {
        filterEntries[key] = entries[key]
      }
    }
  }

  return filterEntries
}

// options传入获取过滤后的入口
const getFilterEntries = (globPath, shouldFilter) => {
  if (shouldFilter && shouldFilter === 'filter') {
    return filterEntries(getEntry(globPath))
  } else {
    return getEntry(globPath)
  }
}

// 将单独打包的配置注入到入口当中
const setSplitChunksToEntry = (entries) => {
  for (let chunk in splitChunksConfig) {
    entries[chunk] = splitChunksConfig[chunk]
  }

  return entries
}

module.exports = {
  getEntry,
  getFilterEntries,
  setSplitChunksToEntry
}