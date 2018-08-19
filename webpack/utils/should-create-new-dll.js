const fs = require('fs-extra')
const { resolve } = require('path')
const currentDependencies = require('../../package.json').dependencies

let oldDependenciesPath = resolve(process.cwd(), './public/dependencies.txt')

const shouldCreateNewDll = () => {
  let oldDepExist = fs.existsSync(oldDependenciesPath)
  
  // 不存在直接创建dll文件
  if (!oldDepExist) {
    let dependencies = JSON.stringify(currentDependencies)
    
    // 输出当前依赖到dependencies.txt
    fs.outputFileSync(oldDependenciesPath, dependencies)

    return true
  }

  // 存在，则对比依赖是否变化
  let oldDependencies = JSON.parse(fs.readFileSync(oldDependenciesPath))
  let oldDependenciesAmount = Object.keys(oldDependencies).length
  let currentDependenciesAmount = Object.keys(currentDependencies).length
  
  // 依赖相等则遍历对比，否则直接创建dll
  if (oldDependenciesAmount === currentDependenciesAmount) {
    for (let dep in currentDependencies) {
      // 不存在则创建dll
      if (!oldDependencies[dep]) {
        return true
      }
    }
  } else {
    let dependencies = JSON.stringify(currentDependencies)

    // 更新当前依赖
    fs.outputFileSync(oldDependenciesPath, dependencies)

    return true
  }

  // 不需要创建
  return false
}

module.exports = shouldCreateNewDll