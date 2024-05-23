import { Router } from '../App/Router/Router';
import { PagePath } from '../App/Router/types';

describe('navigate functionality', () => {
  const values = Object.values(PagePath);
  const router = new Router([]);
  values.forEach((value) => {
    test(`it should go to page ${value}`, () => {
      expect(router.navigate(value)).toBe(window.location.pathname);
    });
  });
});
