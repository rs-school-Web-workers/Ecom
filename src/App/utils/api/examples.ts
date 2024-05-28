/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
require('dotenv').config();
const util = require('util');
import {
  changeUserProfile,
  getProductById,
  getProducts,
  getUserProfile,
  loginClient,
  passwordReset,
  searchProducts,
} from './Client';

/* to run this file npx ts-node src/App/utils/api/examples.ts */

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

    /* const elems1 = await getProducts();
    show(elems1.body.results[0].masterData.current.name); */

    /* const elems2 = await searchProducts(
      { fullText: { field: 'name', language: 'en-US', value: 'Chair', caseInsensitive: false, mustMatch: 'any' } },
      [{ field: 'name', language: 'en-US', order: 'asc' }]
    );
    show(elems2); */

    /* const elems3 = await getProductById(elems2.body.results[0].id);
    show(elems3); */

    /* const elems4 = await getUserProfile();
    show(elems4); */

    /* const elems5 = await getUserProfile();
    show(elems5);
    changeUserProfile(elems5.body.version, 'REQUESTTEST', 'REQUESTTEST', 'asd@asd.asd', '2000-10-21');
    show(await getUserProfile()); */

    const elems6 = await getUserProfile();
    show(elems6);
    passwordReset(elems6.body.version, 'ASDasdasd1', 'ASDASDasd1');
  } catch (err) {
    console.log(err);
  }
})();
