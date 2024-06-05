import Component from '../utils/base-component';
import * as style from './modal.module.scss';

export class Modal {
  background: HTMLDivElement;

  modal: HTMLDivElement | null;

  container: HTMLDivElement;

  header: HTMLDivElement;

  content: HTMLDivElement;

  footer: HTMLDivElement;

  constructor(modalClass: string, name: string) {
    this.background = new Component('div', [style.modal_background]).getElement<HTMLDivElement>();
    this.modal = null;
    this.container = new Component('div', [style.modal_content_container]).getElement<HTMLDivElement>();
    this.header = new Component('div', [style.modal_header]).getElement<HTMLDivElement>();
    this.content = new Component('div', [style.modal_content]).getElement<HTMLDivElement>();
    this.footer = new Component('div', [style.modal_footer]).getElement<HTMLDivElement>();
    this.initModal(modalClass, name);
  }

  initModal(modalClass: string, name: string) {
    this.modal = new Component('div', [modalClass, style.modal_container]).getElement<HTMLDivElement>();
    this.createHeader(name);
    this.container.append(this.header, this.content, this.footer);
    this.modal.append(this.container);
    this.background.append(this.modal);
  }

  createHeader(name: string) {
    const nameElement: HTMLHeadingElement = new Component('h2', [style.modal_name]).getElement<HTMLHeadingElement>();
    nameElement.textContent = name;
    const close: HTMLDivElement = new Component('div', [style.modal_close]).getElement<HTMLDivElement>();
    const left_cross: HTMLSpanElement = new Component('span', [style.left_cross]).getElement<HTMLDivElement>();
    const right_cross: HTMLSpanElement = new Component('span', [style.right_cross]).getElement<HTMLDivElement>();
    close.append(left_cross, right_cross);
    close.addEventListener('click', () => this.closeHandler());
    this.modal?.append(close);
    this.header?.append(nameElement);
  }

  closeHandler() {
    this.background?.classList.remove(style.modal_active);
  }

  modalShow() {
    this.background?.classList.add(style.modal_active);
  }

  modalUnshow() {
    this.background?.classList.remove(style.modal_active);
  }

  setContent(content: HTMLDivElement) {
    this.content.append(content);
  }

  setFooter(footer: HTMLDivElement) {
    this.footer.append(footer);
  }

  clickCloseHandler() {
    this.background.classList.remove(style.modal_active);
  }
}
