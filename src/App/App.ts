import { Router } from './Router/Router';
import { ID_ELEMENT, PageInfo, PagePath, SECTION_NAME } from './Router/types';

export class App {
  router: Router;

  container: HTMLElement;

  pageContainer: HTMLDivElement;

  constructor() {
    this.container = document.body;
    this.pageContainer = document.createElement('div');
    const pages: PageInfo[] = this.initPages();
    console.log(pages);
    console.log(window.location);
    this.router = new Router(pages);
    this.createNav();
    this.container.append(this.pageContainer);
  }

  createNav() {
    const navContainer: HTMLElement = document.createElement('nav');
    navContainer.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    const mainButton: HTMLAnchorElement = document.createElement('a');
    mainButton.href = `${PagePath.MAIN}`;
    mainButton.textContent = 'Main';
    const loginButton: HTMLAnchorElement = document.createElement('a');
    loginButton.href = `${PagePath.LOGIN}`;
    loginButton.textContent = 'Login';
    const registrationButton: HTMLAnchorElement = document.createElement('a');
    registrationButton.href = `${PagePath.REGISTRATION}`;
    registrationButton.textContent = 'Registration';
    const productsButton: HTMLAnchorElement = document.createElement('a');
    productsButton.href = `${PagePath.PRODUCTS}`;
    productsButton.textContent = 'Products';
    const productButton: HTMLAnchorElement = document.createElement('a');
    productButton.href = `${PagePath.PRODUCTS}/t-shirts`;
    productButton.textContent = 'T-shirts';
    navContainer.append(mainButton, loginButton, registrationButton, productsButton, productButton);
    this.container.append(navContainer);
  }

  buttonNavigateHandler(event: Event) {
    event.preventDefault();
    const targetElem: HTMLAnchorElement | null = <HTMLAnchorElement>event.target;
    if (targetElem) {
      const navigateLink: string | null = targetElem.getAttribute('href');
      if (navigateLink) {
        this.router.navigate(navigateLink);
        this.router.renderPageView(navigateLink);
      }
    }
  }

  initPages() {
    const pages: PageInfo[] = [
      {
        pagePath: '/',
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.LOGIN,
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.LOGIN;
        },
      },
      {
        pagePath: PagePath.MAIN,
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.REGISTRATION,
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.REGISTRATION;
        },
      },
      {
        pagePath: PagePath.PRODUCTS,
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.PRODUCTS;
        },
      },
      {
        pagePath: `${PagePath.PRODUCTS}/${SECTION_NAME}`,
        render: (section_name: string = '') => {
          this.pageContainer.textContent = 'This is ' + PagePath.PRODUCTS + `/${section_name}`;
        },
      },
      {
        pagePath: `${PagePath.PRODUCTS}/${SECTION_NAME}/${ID_ELEMENT}`,
        render: (section_name: string = '', id: string = '') => {
          this.pageContainer.textContent = 'This is ' + PagePath.PRODUCTS + `/${section_name}/${id}`;
        },
      },
      {
        pagePath: PagePath.NOT_FOUND,
        render: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.NOT_FOUND;
        },
      },
    ];
    return pages;
  }
}
