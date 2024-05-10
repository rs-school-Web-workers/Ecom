import { PageInfo, PagePath } from './types';

export class Router {
  pages: PageInfo[];

  constructor(pages: PageInfo[]) {
    this.pages = pages;
    window.addEventListener('DOMContentLoaded', this.browserLineListener.bind(this));
    window.addEventListener('popstate', this.browserLineListener.bind(this));
  }

  navigate(path: string) {
    console.log(path);
    const pageInfo: PageInfo | undefined = this.pages.find((item) => item.pagePath === path);
    if (pageInfo) {
      pageInfo.callback();
    } else {
      this.redirectToPageNotFound();
    }
  }

  redirectToPageNotFound() {
    const pageNotFound: PageInfo | undefined = this.pages.find((item) => item.pagePath === PagePath.NOT_FOUND);
    if (pageNotFound) {
      this.navigate(PagePath.NOT_FOUND);
    }
  }

  browserLineListener() {
    const pagePath: string = window.location.pathname.slice(1);
    this.navigate(pagePath);
  }
}
