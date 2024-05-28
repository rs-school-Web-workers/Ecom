import { App } from '../App/App';
import { notFoundClassNames } from '../App/Page/NotFoundPage/types';
import { PagePath } from '../App/Router/types';
import { isNull } from '../App/utils/base-methods';
import { ContentClassesTest } from './types';

describe('render functionality', () => {
  const app = new App();
  app.router.navigate(PagePath.NOT_FOUND);
  app.router.renderPageView(PagePath.NOT_FOUND);
  const button: HTMLButtonElement | null = app.contentContainer.querySelector(
    `.${notFoundClassNames.NOT_FOUND_BACK_BUTTON}`
  );
  isNull(button);
  button.click();
  test(`should navigate address bar to main page`, () => {
    expect(PagePath.MAIN).toBe(window.location.pathname);
  });

  test(`should render content container to main page`, () => {
    expect(app.contentContainer.querySelector(`.${ContentClassesTest[PagePath.MAIN]}`)).not.toBeNull();
  });
});
