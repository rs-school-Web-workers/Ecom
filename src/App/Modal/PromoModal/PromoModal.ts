import Component from '../../utils/base-component';
import { Modal } from '../Modal';
import * as style from './promoModal.module.scss';

export class PromoModal extends Modal {
  contentMessage: HTMLDivElement;
  constructor(name: string, message: string = '') {
    super(style.modal_promo, name);
    this.contentMessage = new Component('div', [style.promo_content_container]).getElement<HTMLDivElement>();
    this.initProductModal(message);
  }

  initProductModal(message: string) {
    this.createFooter();
    this.setContent(this.contentMessage);
    this.setMessage(message);
  }

  createFooter() {
    const container: HTMLDivElement = new Component('div', [
      style.promo_buttons_container,
    ]).getElement<HTMLDivElement>();
    const okButton: HTMLButtonElement = new Component('button', [
      style.promo_ok_button,
    ]).getElement<HTMLButtonElement>();
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => this.clickOkHandler());
    container.append(okButton);
    this.setFooter(container);
  }

  clickOkHandler() {
    this.modalUnshow();
  }

  setMessage(message: string) {
    this.contentMessage.textContent = message;
  }
}
