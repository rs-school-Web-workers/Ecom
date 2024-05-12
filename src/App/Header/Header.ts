import { Router } from '../Router/Router';
import { PagePath } from '../Router/types';
import Component from '../utils/base-component';
import './header.scss';
import '../../components/fonts/fonts.scss';
import { COMPANY_NAME, headerClassNames, headerLinkNames } from './types';

export default class Header {
  router: Router;

  container: HTMLElement;

  constructor(router: Router) {
    this.router = router;
    this.container = this.createHeader();
  }

  createHeader() {
    const header: Component = new Component('header', [headerClassNames.HEADER]);
    const shopName: HTMLHeadingElement = this.createLogo(COMPANY_NAME, [headerClassNames.SHOP_NAME]);
    const navContainer: HTMLElement = this.createNavigateContainer();
    navContainer.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    header.setChildren(shopName, navContainer);
    return header.getElement<HTMLElement>();
  }

  createNavigateContainer() {
    const navElement: Component = new Component('nav', [headerClassNames.NAV_ELEMENT]);
    const menuLink: HTMLAnchorElement = this.createNavigateLink(headerLinkNames.MENU, PagePath.MAIN);
    const loginLink: HTMLAnchorElement = this.createNavigateLink(headerLinkNames.LOGIN, PagePath.LOGIN);
    const registrationLink: HTMLAnchorElement = this.createNavigateLink(
      headerLinkNames.REGISTRATION,
      PagePath.REGISTRATION
    );
    navElement.setChildren(menuLink, loginLink, registrationLink);
    return navElement.getElement<HTMLElement>();
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

  createNavigateLink(linkName: string, path: string) {
    const link: HTMLAnchorElement = new Component('a', [
      headerClassNames.NAVIGATE_LINK,
    ]).getElement<HTMLAnchorElement>();
    link.href = path;
    link.textContent = linkName;
    return link;
  }

  createLogo(name: string, classes: string[]) {
    const logo: Component = new Component('h1', classes);
    logo.setTextContent(name);
    return logo.getElement<HTMLHeadingElement>();
  }
}
