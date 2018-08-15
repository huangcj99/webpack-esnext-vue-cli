import {dep1} from '../../libs/dep-1.js';

const main = async () => {
  console.log('Dependency 1 value:', dep1);

  const {import1} = await import('../../libs/import-1');
  console.log('Dynamic Import 1 value:', import1);
};

main();