import { App } from '../App/App';
import { ContentClassesHeaderArrayTest } from './types';

describe('header buttons functionality', () => {
  const app = new App();
  const buttons: HTMLAnchorElement[] = [...app.header.container.getElementsByTagName('a')];
  buttons.forEach((button, index) => {
    test(`it render content container to ${button.textContent}-page`, () => {
      button.click();
      expect(app.contentContainer.querySelector(`.${ContentClassesHeaderArrayTest[index]}`)).not.toBeNull();
    });
  });
});
