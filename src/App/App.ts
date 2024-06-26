import { Router } from './Router/Router';
import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME } from './Router/types';
import '../assets/css/normalize.css';
import Header, { showLoginButton, showLogoutButton, showUserProfileLink } from './components/header/Header';
import Component from './utils/base-component';
import { isNull } from './utils/base-methods';
import Page from './Page/Page';
import MainPage from './Page/MainPage/MainPage';
import NotFoundPage from './Page/NotFoundPage/NotFoundPage';
import LoginPage from './Page/Login/Login';
import { autoLoginCLient, getAnonClient, isLogged } from './utils/api/Client';
import RegistrationPage from './Page/Registration/Registration';
import { UserProfilePage } from './Page/UserProfile/UserProfile';
import { CatalogPage } from './Page/CatalogPage/Catalog';
import ProductPage from './Page/Product/Product';
import * as style from './app.module.scss';
import { AboutUsPage } from './Page/AboutUsPage/AboutUs';
import { BasketPage } from './Page/BasketPage/Basket';

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
    /* (async () => {
      let cartId = 'error-cart';
      if (localStorage.getItem('token')) {
        await autoLoginCLient();
        await getCart().then((el) => (cartId = el!));
      } else {
        await getAnonClient();
        await getCart().then((el) => (cartId = el!));
      }
      console.log(cartId);
    })(); */
    this.container = document.body;
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
    showUserProfileLink();
    showLoginButton();
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
        pagePath: PagePath.USERPROFILE,
        render: () => {
          if (isLogged()) {
            const userProfilePage = new UserProfilePage();
            this.setPage(userProfilePage);
          } else {
            this.router.navigate(PagePath.MAIN);
            this.router.renderPageView(PagePath.MAIN);
          }
        },
      },
      {
        pagePath: PagePath.BASKET,
        render: () => {
          const basketPage = new BasketPage(this.router);
          this.setPage(basketPage);
        },
      },
      {
        pagePath: PagePath.ABOUTUS,
        render: () => {
          const aboutUsPage = new AboutUsPage();
          this.setPage(aboutUsPage);
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
          const productPage = new CatalogPage(this.router);
          this.setPage(productPage);
        },
      },
      {
        pagePath: `${PagePath.PRODUCTS}/${SECTION_NAME}`,
        render: (section_name: string = '') => {
          const productPage = new CatalogPage(this.router, section_name);
          this.setPage(productPage);
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
