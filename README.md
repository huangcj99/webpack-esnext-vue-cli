## Webpack Esnext CLI

### 一、Feature

- [Webpack4](https://webpack.github.io)
- [支持输出ES6与ES5包, 并且引入到html页面](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)
- [多入口]()
- [添加eruda移动调试工具](https://github.com/liriliri/eruda)

Todo:
- [preload and prefetch]()
- [增加移动端适配相关postcss插件]()

### 二、Start

> node version >= v8.11.1

development:
```
npm install

// 开启proxy-server，用于与服务端联调
npm run dev 

// 开启mock-server
npm run dev:mock

// open the broswer, http://localhost:9000
```

production(or test):
```
npm run build:prod
```

### 三、如何注入依赖chunk

采用[nunjucks](https://mozilla.github.io/nunjucks/cn/getting-started.html)模板引擎为html入口注入打包的资源

页面对应的文件说明
```
├── bin # 编译部署等脚本
|
├── public # 编译输出
|
├── src # 源文件目录
|   ├── assets # 网站公共资源以及全局css
|   |
|   ├── components # 公共组件
|   |
|   ├── libs # 库
|   |
|   ├── pages # 页面
|         ├── test # 页面文件夹
|               ├── components # 存放vue组件
|               ├── test.html # 模板html
|               ├── test.scss # scss文件用于非单文件scss编写
|               ├── test.vue # vue组件入口
|               ├── test.js # js入口（modern入口）
|               ├── test-legacy.js # js入口（legacy入口，打包时会自动根据modern入口创建，不需要手动创建，你要手动新建个也是可以的）
|
├── webpack
|   ├── compile # 打包时输出modern包和legacy包的配置
|   ├── loader # loader配置（babel-loader涉及到打包所以放在了compile下）
|   ├── utils # 工具
|   ├── config
|   |      ├── project.config.js # 开发/线上配置，以及开发代理接口配置
|   |      ├── dev-include-entries.config.js # 开发时可配置需要编译的入口
|   |      ├── exclude-entries.config.js # 打包时可配置排除的入口
|   |      ├── postcss.config.js # postcss插件配置
|   |      ├── split-chunks.config.js # 可配置多个chunk打包
|   |
|   ├── dll.config.js #  用于打包开发vendor.dll.js的配置文件(本地开发时，避免重复编译vendor，节省时间)
|   ├── dev.config.js # 本地开发配置
|   ├── test.config.js # 测试配置
|   ├── prod.config.js # 线上配置
|
```

#### 1、注入js与css依赖:

注：你需要注释{{ 'css' | addAssets() }}这种模板语法，避免与dev环境产生冲突，打包时脚本会去掉注释的符号
```
<head>
  ...
  <!-- {{ 'css' | addAssets() }} -->
</head>

<body>
  ...
  <!-- {{ 'js' | addAssets() }} -->
</body>
```

addAssets方法默认注入['manifest', 'vendor', 'commons', '入口']，默认会在modern chunk后注入legacy chunk

默认的依赖配置可以在webpack/config/split-chunk.config.js配置
```
// 入口默认加载的chunk
const defaultAssetsConfig = {
  chunks: [
    'manifest:inline', // manifest比较小，默认内联
    'vendor', 
    'commons'
  ]
}
```

当然也可以自行配置依赖的chunk（入口默认注入），比如：
```
<body>
  ...
  <!-- {{ 'js' | addAssets(['manifest:inline', 'vendor', 'spa-vendor', 'commons']) }} -->
</body>
```
addAssets方法可以传入一个chunks数组，'chunk:inline'可以将chunk内联，建议对manifest和较小的入口js进行内联

注：css默认会引入commons和入口css，这里不提供css的自由注入

#### 2、html中注入loading首屏
```
<head>
  ...
  <!-- {{ 'loading-css' | addAssets() }} -->
</head>

<body>
  <div id="app">
    <!-- {{ 'loading-html' | addAssets() }} -->
  </div>

  ...
</body>
```

#### 3、chunk分割
```
const splitChunksConfig = {
  // 项目基础包
  'vendor': {
    test: /node_modules\/vue/g,
    name: 'vendor',
    chunks: 'all',
    enforce: true,
    priority: 2
  },
  // 单页面需要引入vue-router，这里单独分割出来
  'spa-vendor': {
    test: /node_modules\/vue-router/g,
    name: 'spa-vendor',
    chunks: 'all',
    enforce: true, 
    priority: 11
  },
  // 剩余chunk自动分割
  'commons': {
    name: 'commons',
    minChunks: 2,
    minSize: 0,
    chunks: 'all',
    priority: 1
  }
}
```
根据优先级进行chunk分割，commons优先级最低，在其他手动配置的chunk匹配完成后，才对剩余的chunk进行打包，这里的分割配置按照项目需求划分就好了

### 四、开发时与打包时的入口过滤
1、开发时（webpack/config/dev-include-entries.config.js）
```
// 减少构建入口，加快开发时刷新的速度，如下，仅构建a/下的页面，全部页面构建数组第一个需要为'all'
const filterEntries = [
  // 'all',

  '/a',
]

module.exports = filterEntries
```

2、打包（webpack/config/exclude-entries.config.js）
```
// 将test目录下在打包时排除 
const filterEntries = [
  'test/',
]

module.exports = filterEntries
```

### 五、项目配置

#### 1、全局变量设置

```
// webpack/config/project.config.js
let config = {
  ...

  globalVar: {
    development: {
      __MODE__: JSON.stringify(env)
    },
    test: {
      __MODE__: JSON.stringify(env)
    },
    production: {
      __MODE__: JSON.stringify(env)
    }
  },

  ...
}
```

#### 2、proxy-server (开启mock-server后请求将不会经过proxy-server)
```
// webpack/config/project.config.js
let config = {
  ... 

  development: {
    host: 'localhost',
    port: 9000,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    proxy: {
      '/api/**': {
        target: '', // 服务器地址
        changeOrigin: true
      }
    }
  },

  ...
}
```

#### 3、公共文件夹路径别名设置
```
// webpack/config/project.config.js
let config = {
  ...

  resolve: {
    extensions: ['.js', '.vue'],
    //优先搜索src下的公共资源目录
    modules: [
      resolve(process.cwd(), "./src/assets"),
      resolve(process.cwd(), "./src/libs"),
      resolve(process.cwd(), "./src/components"),
      "node_modules"
    ],
    alias: {
      // 公共资源
      'assets': resolve(process.cwd(), './src/assets'),
      'libs': resolve(process.cwd(), './src/libs'),
      'components': resolve(process.cwd(), './src/components')
    }
  }

  ...
}
```

  
