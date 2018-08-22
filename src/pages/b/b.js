import 'assets/css/reset.css'
import {dep2} from '../../libs/dep-2'
import testChunk from '../../libs/test-chunk'
import common from '../../libs/common-lib'

const main = async () => {
  console.log('Dependency 2 value:', dep2)

  console.log(testChunk)

  console.log(common)
  
  const {import2} = await import(/* webpackChunkName: "import-2" */ '../../libs/import-2')
  console.log('Dynamic Import 2 value:', import2)

  ;(async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('async')
      }, 2000)
    })
  })()
}

main()