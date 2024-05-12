import { Router } from './Router/Router';
import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME } from './Router/types';
import '../components/css/normalize.css';
import Header from './Header/Header';
import Component from './utils/base-component';

export class App {
  router: Router;

  container: HTMLElement;

  header: Header;

  contentContainer: HTMLDivElement;

  constructor() {
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
          this.contentContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.LOGIN,
        render: () => {
          this.contentContainer.textContent = 'This is ' + PagePath.LOGIN;
        },
      },
      {
        pagePath: PagePath.MAIN,
        render: () => {
          this.contentContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.REGISTRATION,
        render: () => {
          this.contentContainer.textContent = 'This is ' + PagePath.REGISTRATION;
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
          this.contentContainer.textContent = 'This is ' + PagePath.NOT_FOUND;
        },
      },
    ];
    return pages;
  }
}
