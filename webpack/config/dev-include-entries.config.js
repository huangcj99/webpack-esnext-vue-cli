/**
*   如：text/text.html这个页面需要构建则
*   可填写 'text','text/text'
*   如果需要全部构建，则数组第一项填字符串'all',否则则去掉
*/
const defaultFilterEntries = [
  'all',

  '/a',
  '/b',
  // 'test/',
]
const inputs = process.argv.slice(2)

const filterEntries = inputs.length > 0 ? inputs : defaultFilterEntries

module.exports = filterEntries
