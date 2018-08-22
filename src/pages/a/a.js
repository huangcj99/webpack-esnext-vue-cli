import 'assets/css/reset.css'
import {dep1} from '../../libs/dep-1.js'
import testChunk from '../../libs/test-chunk'
import common from '../../libs/common-lib'
import Vue from 'vue'

const main = async () => {
  console.log('Dependency 1 value:', dep1)

  console.log(testChunk)

  console.log(common)

  const {import1} = await import(/* webpackChunkName: "import-1" */ '../../libs/import-1');
  console.log('Dynamic Import 1 value:', import1)

  ;(async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('async')
      }, 2000)
    })
  })()

  fetch('/api/v1/coup')
    .then((res) => res.json())
    .then(data => {
      console.log(data)
    })

  console.log(Vue)
};

main();