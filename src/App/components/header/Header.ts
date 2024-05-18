import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';
import Component from '../../utils/base-component';
import './header.scss';
import '../../../assets/fonts/fonts.scss';
import { isNull } from '../../utils/base-methods';
import {
  COMPANY_NAME,
  NAME_CONTAINER,
  NAV_CONTAINER,
  burgerClassNames,
  headerClassNames,
  headerLinkNames,
} from './types';

export default class Header {
  router: Router;

  container: HTMLElement;

  constructor(router: Router) {
    this.router = router;
    this.container = this.createHeader();
  }

  createHeader() {
    const header: Component = new Component('header', [headerClassNames.HEADER]);
    const nameContainer: HTMLDivElement = this.createNameContainer();
    const navContainer: HTMLDivElement = this.createNavigateContainer();
    navContainer.addEventListener('click', (event) => this.buttonNavigateHandler(event));
    header.setChildren(nameContainer, navContainer);
    return header.getElement<HTMLElement>();
  }

  createNameContainer() {
    const container: Component = new Component('div', [NAME_CONTAINER]);
    const burger: HTMLDivElement = this.createBurgerMenu();
    burger.addEventListener('click', (event) => this.burgerClickHandler(event));
    const shopName: HTMLHeadingElement = this.createLogo(COMPANY_NAME, [headerClassNames.SHOP_NAME]);
    container.setChildren(burger, shopName);
    return container.getElement<HTMLDivElement>();
  }

  createBurgerMenu() {
    const burger: Component = new Component('div', [burgerClassNames.BURGER]);
    const topLine: HTMLSpanElement = new Component('span', [
      burgerClassNames.BURGER_LINE,
    ]).getElement<HTMLSpanElement>();
    const middleLine: HTMLSpanElement = new Component('span', [
      burgerClassNames.BURGER_LINE,
    ]).getElement<HTMLSpanElement>();
    const bottomLine: HTMLSpanElement = new Component('span', [
      burgerClassNames.BURGER_LINE,
    ]).getElement<HTMLSpanElement>();
    burger.setChildren(topLine, middleLine, bottomLine);
    return burger.getElement<HTMLDivElement>();
  }

  createNavigateContainer() {
    const navContainer: Component = new Component('div', [NAV_CONTAINER]);
    const navElement: Component = new Component('nav', [headerClassNames.NAV_ELEMENT]);
    const menuLink: HTMLAnchorElement = this.createNavigateLink(headerLinkNames.MAIN, PagePath.MAIN);
    const loginLink: HTMLAnchorElement = this.createNavigateLink(headerLinkNames.LOGIN, PagePath.LOGIN);
    const registrationLink: HTMLAnchorElement = this.createNavigateLink(
      headerLinkNames.REGISTRATION,
      PagePath.REGISTRATION
    );
    navElement.setChildren(menuLink, loginLink, registrationLink);
    navContainer.setChildren(navElement.getElement<HTMLElement>());
    return navContainer.getElement<HTMLDivElement>();
  }

  buttonNavigateHandler(event: Event) {
    event.preventDefault();
    const targetElem: HTMLAnchorElement | null = <HTMLAnchorElement>event.target;
    if (targetElem) {
      const navigateLink: string | null = targetElem.getAttribute('href');
      if (navigateLink) {
        this.hideNavigateBlock();
        this.router.navigate(navigateLink);
        this.router.renderPageView(navigateLink);
      }
    }
  }

  burgerClickHandler(event: Event) {
    const element: HTMLDivElement = <HTMLDivElement>event.currentTarget;
    element.classList.toggle(burgerClassNames.BURGER_ACTIVE);
    const navigateContainer: HTMLDivElement | null = document.querySelector<HTMLDivElement>(`.${NAV_CONTAINER}`);
    isNull(navigateContainer);
    navigateContainer.classList.toggle(burgerClassNames.ACTIVE);
    document.body.classList.toggle(burgerClassNames.NO_SCROLL);
  }

  hideNavigateBlock() {
    const burger: HTMLDivElement | null = document.querySelector<HTMLDivElement>(`.${burgerClassNames.BURGER}`);
    isNull(burger);
    burger.classList.toggle(burgerClassNames.BURGER_ACTIVE);
    const navigateContainer: HTMLDivElement | null = document.querySelector<HTMLDivElement>(`.${NAV_CONTAINER}`);
    isNull(navigateContainer);
    navigateContainer.classList.toggle(burgerClassNames.ACTIVE);
    document.body.classList.toggle(burgerClassNames.NO_SCROLL);
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
