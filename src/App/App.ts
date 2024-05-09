import { Router } from './Router/Router';
import { PageInfo, PagePath } from './Router/types';

export class App {
  router: Router;

  constructor() {
    const pages: PageInfo[] = this.initPages();
    this.router = new Router(pages);
  }

  initPages() {
    const pages: PageInfo[] = [
      {
        pagePath: PagePath.LOGIN,
        callback: () => {},
      },
      {
        pagePath: PagePath.MAIN,
        callback: () => {},
      },
      {
        pagePath: PagePath.REGISTRATION,
        callback: () => {},
      },
      {
        pagePath: PagePath.NOT_FOUND,
        callback: () => {},
      },
    ];
    return pages;
  }
}
