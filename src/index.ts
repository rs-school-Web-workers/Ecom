import { test } from './test';
import { getApiRoot } from './utils/api/Client';

console.log('index.ts', test);
getApiRoot('asd@asd.asd', 'asd')
  .orders()
  .get()
  .execute()
  .then(({ body }) => {
    console.log(JSON.stringify(body));
  })
  .catch(console.error);
