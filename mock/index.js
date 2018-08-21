const path = require('path')
const bodyParser = require('body-parser')
const pathToRegexp = require('path-to-regexp')
const chokidar = require('chokidar')
const parse = require('url').parse

let proxyList = {}

// handle path params
function pathMatch(path) {
  const options = {
    sensitive: false,
    strict: false,
    end: false
  }
  let keys = []
  let re = pathToRegexp(path, keys, options)
  return function(pathname, params = {}) {
    var m = re.exec(pathname)
    if (!m) return false
    var key, param
    for (var i = 0; i < keys.length; i++) {
      key = keys[i]
      param = m[i + 1]
      if (!param) continue
      params[key.name] = decodeURIComponent(param)
      if (key.repeat) params[key.name] = params[key.name].split(key.delimiter)
    }
    return params
  }
}

/**
 * TODO:
 * 1. 区分开发环境和正式环境的打包
 */

/**
 * @param {string} entryPath mock配置文件入口，监听入口文件及同目录下所有文件，保证热重载mock配置文件
 * @param {obj} app
 * @returns void
 */
module.exports = function(entryPath, app) {
  const entryDirPath = path.dirname(entryPath)
  proxyList = require(entryPath)
  // watch mock DIR
  var watcher = chokidar.watch(entryDirPath)
  watcher.on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // pre-reference
        const mockData = require(entryPath)
        // if no error & cleanCache
        cleanCache(path)
        if (path !== entryPath || path !== __filename) {
          cleanCache(entryPath)
        }
        // require again
        proxyList = require(entryPath)
      } catch (err) {}
    }
  })
  
  // handle request
  app.all('/*', function(req, res, next) {
    const reqURL = `${req.method} ${req.path}`
    const containMockURL = Object.keys(proxyList).filter(function(kname) {
      const mockURL = kname.split(' ')
      if (mockURL && mockURL.length === 2 && mockURL[0] === req.method) {
        return !!pathMatch(mockURL[1])(parse(req.url).pathname) // if has params
      } else {
        return false
      }
    })
    if (proxyList[reqURL] || (containMockURL && containMockURL.length > 0)) {
      let bodyParseMethod = bodyParser.json()
      const contentType = req.get('Content-Type')
      if (contentType === 'text/plain') {
        bodyParseMethod = bodyParser.raw({ type: 'text/plain' })
      }
      bodyParseMethod(req, res, function() {
        const mockData = proxyList[reqURL] || proxyList[containMockURL[0]]
        if (typeof mockData === 'function') {
          //  inject path params to req
          if (containMockURL[0]) {
            const mockURL = containMockURL[0].split(' ')
            if (mockURL && mockURL.length === 2 && req.method === mockURL[0]) {
              const getParams = pathMatch(mockURL[1])
              req.params = getParams(parse(req.url).pathname)
            }
          }
          mockData(req, res, next)
        } else {
          res.json(mockData)
        }
      })
    } else {
      next()
    }
  })

  function cleanCache(modulePath) {
    var module = require.cache[modulePath]
    if (!module) return
    // remove reference in module.parent
    if (module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1)
    }
    // remove cache
    delete require.cache[modulePath]
  }

  return function(req, res, next) {
    next()
  }
}
