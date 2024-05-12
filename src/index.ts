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

/* getApiRoot()
  .customers()
  .post({
    body: {
      email: 'johndoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret123',
    },
  })
  .execute()
  .then(({ body }) => {
    console.log(JSON.stringify(body));
  })
  .catch(console.error); */
