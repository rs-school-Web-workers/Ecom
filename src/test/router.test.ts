import { App } from '../App/App';
import { Router } from '../App/Router/Router';
import { PagePath } from '../App/Router/types';
import { ContentClassesArrayTest, PagePathTest } from './types';

describe('navigate functionality', () => {
  const values = Object.values(PagePath);
  const router = new Router([]);
  values.forEach((value) => {
    test(`it should go to page ${value}`, () => {
      expect(router.navigate(value)).toBe(window.location.pathname);
    });
  });
});

describe('render functionality', () => {
  const app = new App();
  const values = Object.values(PagePathTest);
  values.forEach((value, index) => {
    test(`it render content container to ${value}-page`, () => {
      app.router.renderPageView(value);
      expect(app.contentContainer.querySelector(`.${ContentClassesArrayTest[index]}`)).not.toBeNull();
    });
  });
});
