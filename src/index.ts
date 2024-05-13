import { test } from './test';
import { getApiRoot } from './utils/api/Client';

console.log('index.ts', test);
getApiRoot('asd@asd.asd', 'asd').me().orders().get().execute().catch(console.error);
getApiRoot().get().execute().then().catch(console.error);

//signIn('asd1@asd.asd', 'test', 'testov', 'asd');
