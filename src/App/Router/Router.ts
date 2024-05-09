import { PageInfo, PagePath } from './types';

export class Router {
  pages: PageInfo[];

  constructor(pages: PageInfo[]) {
    this.pages = pages;
  }

  navigate(path: string) {
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
}
