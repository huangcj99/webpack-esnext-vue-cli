import {dep1} from '../../libs/dep-1.js';
import testChunk from '../../libs/test-chunk'

const main = async () => {
  console.log('Dependency 1 value:', dep1);

  console.log(testChunk)

  const {import1} = await import(/* webpackChunkName: "import-1" */ '../../libs/import-1');
  console.log('Dynamic Import 1 value:', import1);

  (async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('async')
      }, 2000)
    })
  })()
};

main();