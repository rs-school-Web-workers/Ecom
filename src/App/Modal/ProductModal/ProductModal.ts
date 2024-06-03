import Component from '../../utils/base-component';
import { Modal } from '../Modal';
import * as style from './productModal.module.scss';
import './slider';
import './slider.css';

export class ProductModal extends Modal {
  imgArray: string[];

  constructor(name: string, array: string[]) {
    super(style.modal_product, name);
    this.imgArray = array;
    this.initProductModal();
  }

  initProductModal() {
    this.createFooter();
    this.createContent();
  }

  createFooter() {
    const container: HTMLDivElement = new Component('div', [
      style.product_buttons_container,
    ]).getElement<HTMLDivElement>();
    const okButton: HTMLButtonElement = new Component('button', [
      style.product_ok_button,
    ]).getElement<HTMLButtonElement>();
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => this.clickOkHandler());
    container.append(okButton);
    this.setFooter(container);
  }

  clickOkHandler() {
    this.modalUnshow();
  }

  createContent() {
    const sliderContainer: HTMLDivElement = new Component('div', ['swiper-container']).getElement<HTMLDivElement>();
    const sliderWrapper: HTMLDivElement = new Component('div', ['swiper-wrapper']).getElement<HTMLDivElement>();
    this.imgArray.forEach((img) => {
      const slide: HTMLDivElement = new Component('div', ['swiper-slide']).getElement<HTMLDivElement>();
      slide.style.backgroundImage = `url(${img})`;
      sliderWrapper.append(slide);
    });
    const sliderPagination: HTMLDivElement = new Component('div', ['swiper-pagination']).getElement<HTMLDivElement>();
    const sliderPrev: HTMLDivElement = new Component('div', ['swiper-button-prev']).getElement<HTMLDivElement>();
    const sliderNext: HTMLDivElement = new Component('div', ['swiper-button-next']).getElement<HTMLDivElement>();
    sliderContainer.append(sliderWrapper);
    sliderContainer.append(sliderPrev, sliderNext, sliderPagination);
    this.setContent(sliderContainer);
  }
}
