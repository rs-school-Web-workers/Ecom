import Component from '../../utils/base-component';
import { Modal } from '../Modal';
import * as style from './removeAllCards.module.scss';
import * as styleBase from '../modal.module.scss';

const { removeModal, removeModal_buttons_container, removeModal_content_container, removeModal_ok_button } = style;

export class RemoveModalAllCards extends Modal {
  contentMessage: HTMLDivElement;
  constructor(name: string, message: string = '') {
    super(removeModal, name);
    this.contentMessage = new Component('div', [removeModal_content_container]).getElement<HTMLDivElement>();
    this.initProductModal(message);
  }

  initProductModal(message: string) {
    this.createFooter();
    this.setContent(this.contentMessage);
    this.setMessage(message);
  }

  createFooter() {
    const container: HTMLDivElement = new Component('div', [
      removeModal_buttons_container,
    ]).getElement<HTMLDivElement>();
    const confirmButton: HTMLButtonElement = new Component('button', [
      removeModal_ok_button,
    ]).getElement<HTMLButtonElement>();
    const cancelButton = new Component('button', [removeModal_ok_button]).getElement<HTMLButtonElement>();
    confirmButton.textContent = 'Confirm';
    confirmButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';
    confirmButton.addEventListener('click', (e) => this.clickOkHandler(e));
    cancelButton.addEventListener('click', () => this.modalUnshow());
    container.append(confirmButton, cancelButton);
    this.setFooter(container);
  }

  clickOkHandler(event: Event) {
    this.modalUnshow();
    const setTrueEvent = new CustomEvent('removeAllCards', {
      detail: {
        state: this.background?.classList.contains(styleBase.modal_active),
      },
      cancelable: true,
    });
    event.target?.dispatchEvent(setTrueEvent);
  }

  setMessage(message: string) {
    this.contentMessage.textContent = message;
  }
}
