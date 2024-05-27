// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { getProducts, loginClient } from './Client';

const localStorageMock = (function () {
  let store: { [str: string]: string } = {};
  return {
    getItem: function (key: string): string {
      return store[key];
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: string) {
      delete store[key];
    },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

console.log(process.env.PROJECT_KEY);

loginClient('asd@asd.asd', 'ASDasdasd1');
getProducts()
  .then((products) => console.log(products))
  .catch((err) => console.log(err));
