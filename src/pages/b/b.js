import {dep2} from './dep-2.js'

const main = async () => {
  console.log('Dependency 2 value:', dep2)

  const {import2} = await import('./import-2.js')
  console.log('Dynamic Import 2 value:', import2)
}

main()