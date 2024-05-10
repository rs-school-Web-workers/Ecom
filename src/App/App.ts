import { Router } from './Router/Router';
import { PageInfo, PagePath } from './Router/types';

export class App {
  router: Router;

  container: HTMLElement;

  pageContainer: HTMLDivElement;

  constructor() {
    document.head.innerHTML += document.head.innerHTML + "<base href='" + document.location.href + "' />";
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
    const mainButton: HTMLAnchorElement = document.createElement('a');
    mainButton.href = `/${PagePath.MAIN}`;
    mainButton.textContent = 'Main';
    mainButton.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    const loginButton: HTMLAnchorElement = document.createElement('a');
    loginButton.href = `/${PagePath.LOGIN}`;
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    const registrationButton: HTMLAnchorElement = document.createElement('a');
    registrationButton.href = `/${PagePath.REGISTRATION}`;
    registrationButton.textContent = 'Registration';
    registrationButton.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    navContainer.append(mainButton, loginButton, registrationButton);
    this.container.append(navContainer);
  }

  buttonNavigateHandler(event: Event) {
    event.preventDefault();
    const targetElem: HTMLAnchorElement | null = <HTMLAnchorElement>event.currentTarget;
    if (targetElem) {
      const navigateLink: string | null = targetElem.getAttribute('href');
      window.history.pushState({}, '', navigateLink);
      if (navigateLink) {
        this.router.navigate(navigateLink.slice(1));
      }
    }
  }

  initPages() {
    const pages: PageInfo[] = [
      {
        pagePath: '',
        callback: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.LOGIN,
        callback: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.LOGIN;
        },
      },
      {
        pagePath: PagePath.MAIN,
        callback: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.MAIN;
        },
      },
      {
        pagePath: PagePath.REGISTRATION,
        callback: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.REGISTRATION;
        },
      },
      {
        pagePath: PagePath.NOT_FOUND,
        callback: () => {
          this.pageContainer.textContent = 'This is ' + PagePath.NOT_FOUND;
        },
      },
    ];
    return pages;
  }
}
