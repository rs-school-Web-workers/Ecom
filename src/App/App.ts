import { Router } from './Router/Router';
import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME } from './Router/types';
import '../assets/css/normalize.css';
import Header from './components/header/Header';
import Component from './utils/base-component';
import { isNull } from './utils/base-methods';
import Page from './Page/Page';
import MainPage from './Page/MainPage/MainPage';
import NotFoundPage from './Page/NotFoundPage/NotFoundPage';
import LoginPage from './Page/Login/Login';
import { autoLoginCLient } from './utils/api/Client';

export class App {
  router: Router;

  container: HTMLElement;

  header: Header;

  contentContainer: HTMLDivElement;

  constructor() {
    if (localStorage.getItem('token')) autoLoginCLient();
    this.container = document.body;
    this.contentContainer = document.createElement('div');
    const pages: PageInfo[] = this.initPages();
    this.router = new Router(pages);
    this.header = new Header(this.router);
    this.contentContainer = new Component('div', ['content-container']).getElement<HTMLDivElement>();
    this.initApp();
  }

  initApp() {
    const header: HTMLElement = this.header.container;
    this.container.append(header, this.contentContainer);
  }

  initPages() {
    const pages: PageInfo[] = [
      {
        pagePath: '/',
        render: () => {
          const mainPage: MainPage = new MainPage();
          this.setPage(mainPage);
        },
      },
      {
        pagePath: PagePath.LOGIN,
        render: () => {
          const mainPage = new LoginPage();
          this.setPage(mainPage);
        },
      },
      {
        pagePath: PagePath.MAIN,
        render: () => {
          const mainPage: MainPage = new MainPage();
          this.setPage(mainPage);
        },
      },
      {
        pagePath: PagePath.REGISTRATION,
        render: () => {
          const mainPage: MainPage = new MainPage();
          this.setPage(mainPage);
        },
      },
      {
        pagePath: PagePath.PRODUCTS,
        render: () => {
          this.contentContainer.textContent = 'This is ' + PagePath.PRODUCTS;
        },
      },
      {
        pagePath: `${PagePath.PRODUCTS}/${SECTION_NAME}`,
        render: (section_name: string = '') => {
          this.contentContainer.textContent = 'This is ' + PagePath.PRODUCTS + `/${section_name}`;
        },
      },
      {
        pagePath: `${PagePath.PRODUCTS}/${SECTION_NAME}/${ID_ELEMENT}`,
        render: (section_name: string = '', id: string = '') => {
          this.contentContainer.textContent = 'This is ' + PagePath.PRODUCTS + `/${section_name}/${id}`;
        },
      },
      {
        pagePath: PagePath.NOT_FOUND,
        render: () => {
          const notFoundPage: NotFoundPage = new NotFoundPage(this.router);
          this.setPage(notFoundPage);
        },
      },
    ];
    return pages;
  }

  setPage(page: Page) {
    const pageContainer: HTMLDivElement | null = page.getContainer();
    isNull(pageContainer);
    this.contentContainer.replaceChildren();
    this.contentContainer.append(pageContainer);
  }
}
