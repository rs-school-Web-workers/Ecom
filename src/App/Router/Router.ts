import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME, requestAdressBar } from './types';

export class Router {
  pages: PageInfo[];

  constructor(pages: PageInfo[]) {
    this.pages = pages;
    window.addEventListener('DOMContentLoaded', this.browserLineListener.bind(this));
    window.addEventListener('popstate', this.browserLineListener.bind(this));
  }

  renderPageView(path: string) {
    const request: requestAdressBar = this.parsePath(path);
    const pathForFind: string = this.parsePathForFind(request);
    const pageInfo: PageInfo | undefined = this.pages.find((item) => item.pagePath === pathForFind);
    if (pageInfo) {
      pageInfo.render(request.section_name, request.resource);
    } else {
      this.renderPageView(PagePath.NOT_FOUND);
    }
  }

  parsePathForFind(request: requestAdressBar) {
    console.log(request);
    if (request.section_name !== '' && request.resource !== '') {
      console.log(`/${request.page}/${SECTION_NAME}/${ID_ELEMENT}`);
      return `/${request.page}/${SECTION_NAME}/${ID_ELEMENT}`;
    } else if (request.section_name !== '') {
      console.log(`/${request.page}/${SECTION_NAME}`);
      return `/${request.page}/${SECTION_NAME}`;
    }
    console.log(`/${request.page}`);
    return `/${request.page}`;
  }

  navigate(url: string) {
    window.history.pushState({}, '', url);
  }

  browserLineListener() {
    const pagePath: string = window.location.pathname;
    this.renderPageView(pagePath);
  }

  parsePath(url: string) {
    const request: requestAdressBar = {
      page: '',
      section_name: '',
      resource: '',
    };
    [request.page, request.section_name = '', request.resource = ''] = url.slice(1).split('/');
    return request;
  }
}
