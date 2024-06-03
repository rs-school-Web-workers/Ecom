import { Router } from './Router/Router';
import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME } from './Router/types';
import '../assets/css/normalize.css';
import Header, { showLogoutButton } from './components/header/Header';
import Component from './utils/base-component';
import { isNull } from './utils/base-methods';
import Page from './Page/Page';
import MainPage from './Page/MainPage/MainPage';
import NotFoundPage from './Page/NotFoundPage/NotFoundPage';
import LoginPage from './Page/Login/Login';
import { autoLoginCLient, getAnonClient, isLogged } from './utils/api/Client';
import RegistrationPage from './Page/Registration/Registration';
import ProductPage from './Page/Product/Product';
import * as style from './app.module.scss';

export class App {
  router: Router;

  container: HTMLElement;

  header: Header;

  contentContainer: HTMLDivElement;

  constructor() {
    if (localStorage.getItem('token')) {
      autoLoginCLient();
    } else {
      getAnonClient();
    }
    this.container = document.body;
    console.log(style);
    this.container = new Component('div', [style.app]).getElement<HTMLDivElement>();
    document.body.append(this.container);
    const pages: PageInfo[] = this.initPages();
    this.router = new Router(pages);
    this.header = new Header(this.router);
    this.contentContainer = new Component('div', ['content_container']).getElement<HTMLDivElement>();
    this.initApp();
  }

  initApp() {
    const header: HTMLElement = this.header.container;
    this.container.append(header, this.contentContainer);
    showLogoutButton();
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
          if (isLogged()) {
            this.router.navigate(PagePath.MAIN);
            this.router.renderPageView(PagePath.MAIN);
          } else {
            const loginPage: LoginPage = new LoginPage(this.router);
            this.setPage(loginPage);
          }
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
          if (isLogged()) {
            this.router.navigate(PagePath.MAIN);
            this.router.renderPageView(PagePath.MAIN);
          } else {
            const registrationPage: RegistrationPage = new RegistrationPage(this.router);
            this.setPage(registrationPage);
          }
        },
      },
      {
        pagePath: PagePath.PRODUCTS,
        render: () => {
          const products: HTMLDivElement = new Component('div', ['products-page']).getElement<HTMLDivElement>();
          this.container.replaceChildren();
          this.contentContainer.append(products);
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
        render: (_section_name?: string | undefined, id?: string) => {
          const product: ProductPage = new ProductPage(this.router, id!);
          this.setPage(product);
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
