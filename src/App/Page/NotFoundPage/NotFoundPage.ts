import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';
import Component from '../../utils/base-component';
import Page from '../Page';
import './not-found.scss';
import { BACK_BUTTON_TEXT, NOT_FOUND_MESSAGE_TEXT, NOT_FOUND_PAGE, notFoundClassNames } from './types';

export default class NotFoundPage extends Page {
  constructor(router: Router) {
    super([NOT_FOUND_PAGE]);
    this.initPage(router);
  }

  initPage(router: Router) {
    const animationBlock: Component = new Component('div', [notFoundClassNames.ANIMATION_BLOCK]);
    const messageContainer: Component = new Component('div', [notFoundClassNames.NOT_FOUND_CONTAINER]);
    const messageText: Component = new Component('div', [notFoundClassNames.NOT_FOUND_TEXT]);
    messageText.setTextContent(NOT_FOUND_MESSAGE_TEXT);
    const backButton: HTMLButtonElement = new Component('button', [
      notFoundClassNames.NOT_FOUND_BACK_BUTTON,
    ]).getElement<HTMLButtonElement>();
    backButton.textContent = BACK_BUTTON_TEXT;
    backButton.addEventListener('click', () => {
      router.navigate(PagePath.MAIN);
      router.renderPageView(PagePath.MAIN);
    });
    messageContainer.setChildren(messageText.getElement<HTMLDivElement>(), backButton);
    animationBlock.setChildren(messageContainer.getElement<HTMLDivElement>());
    this.container?.append(animationBlock.getElement<HTMLDivElement>());
  }
}
