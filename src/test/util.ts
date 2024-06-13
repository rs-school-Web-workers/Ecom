import 'isomorphic-fetch';
import req from 'dotenv';

req.config();

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
