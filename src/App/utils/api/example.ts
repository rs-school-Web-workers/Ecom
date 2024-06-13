/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
require('dotenv').config();
const util = require('util');
import { getClient, loginClient } from './Client';

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
const show = (key: any) => {
  console.log(util.inspect(key, { showHidden: false, depth: null, colors: true }));
};

(async () => {
  try {
    await loginClient('asd@asd.asd', 'ASDasdasd1');

    await getClient()
      ?.me()
      .carts()
      .post({
        body: { currency: 'USD' },
      })
      .execute()
      .then((el) => console.log(el));

    await getClient()
      ?.me()
      .activeCart()
      .get()
      .execute()
      .then((el) => console.log(el));
  } catch (err) {
    console.log(err);
  }
})();
