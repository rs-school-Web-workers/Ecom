import { Router } from '../../Router/Router';
import Component from '../../utils/base-component';
import Page from '../Page';
import * as style from './product.module.scss';
import data from '../../../assets/data/products.json';
import { IProduct } from './types';
import { isNull } from '../../utils/base-methods';

export default class ProductPage extends Page {
  router: Router;

  product: IProduct | null;

  currentSlide: number = 0;

  shift: number = 0;

  startTouch: number = 0;

  constructor(router: Router) {
    super([style.product]);
    this.router = router;
    this.product = null;
    this.initProductInfo();
    this.initPage();
  }

  initProductInfo() {
    // запрос информации продукта
    this.product = data.products[0];
  }

  initPage() {
    this.createPathChain();
    this.createProductDetail();
  }

  createProductDetail() {
    const container: HTMLDivElement = new Component('div', [style.product_detail]).getElement<HTMLDivElement>();
    const infoContainer: HTMLDivElement = new Component('div', [style.product_info]).getElement<HTMLDivElement>();
    infoContainer.append(this.createImgContainer(), this.createProductDefinition());
    container.append(this.createPathChain(), infoContainer);
    this.container?.append(container);
  }

  createImgContainer() {
    const container: HTMLDivElement = new Component('div', [style.img_container]).getElement<HTMLDivElement>();
    const smallImgsContainer: HTMLDivElement = new Component('div', [
      style.small_imgs_container,
    ]).getElement<HTMLDivElement>();
    const scrollContainer: HTMLDivElement = new Component('div', [style.scroll_container]).getElement<HTMLDivElement>();
    const mainImgContainer: HTMLImageElement = new Component('img', [
      style.main_img_container,
    ]).getElement<HTMLImageElement>();
    const arrow_left: HTMLDivElement = new Component('div', [
      style.arrow,
      style.arrow_top,
    ]).getElement<HTMLDivElement>();
    const arrow_right: HTMLDivElement = new Component('div', [
      style.arrow,
      style.arrow_bottom,
    ]).getElement<HTMLDivElement>();
    if (this.product !== null && this.product.images.length > 3) {
      scrollContainer.append(arrow_left, arrow_right);
    }
    mainImgContainer.src = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.product?.images[0]}`;
    this.product?.images.forEach((img, index) => {
      const imgContainer: HTMLDivElement = new Component('div', [style.small_img]).getElement<HTMLDivElement>();
      const imgBox: HTMLImageElement = new Component('img', []).getElement<HTMLImageElement>();
      imgBox.src = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${img}`;
      imgBox.addEventListener('click', (event: Event) =>
        this.clickSmallImgHandler(event, mainImgContainer, smallImgsContainer)
      );
      if (index === 0) {
        imgContainer.classList.add(style.active_small_img);
        smallImgsContainer.dataset.slide = this.currentSlide.toString();
        smallImgsContainer.addEventListener('touchstart', (event) => this.touchStartHandler(event));
        smallImgsContainer.addEventListener('touchend', (event) =>
          this.touchEndHandler(event, imgContainer, smallImgsContainer)
        );
        arrow_left.addEventListener('click', () => this.clickPrevHandler(imgContainer, smallImgsContainer));
        arrow_right.addEventListener('click', () => this.clickNextHandler(imgContainer, smallImgsContainer));
      }
      imgContainer.append(imgBox);
      smallImgsContainer.append(imgContainer);
    });
    scrollContainer.append(smallImgsContainer);
    container.append(scrollContainer, mainImgContainer);
    return container;
  }

  clickSmallImgHandler(event: Event, mainImg: HTMLImageElement, container: HTMLDivElement) {
    const elem: HTMLImageElement = <HTMLImageElement>event.target;
    const pastActiveElem: HTMLButtonElement | null = container.querySelector(`.${style.active_small_img}`);
    mainImg.src = elem.src;
    isNull(pastActiveElem);
    pastActiveElem.classList.remove(style.active_small_img);
    elem.classList.add(style.active_small_img);
  }

  touchStartHandler(event: TouchEvent) {
    this.startTouch = event.changedTouches[0].clientX;
  }

  touchEndHandler(event: TouchEvent, slide: HTMLDivElement, container: HTMLDivElement) {
    const endTouch: number = event.changedTouches[0].clientX;
    const distance: number = endTouch - this.startTouch;
    if (distance > 0) {
      this.clickPrevHandler(slide, container);
    } else {
      this.clickNextHandler(slide, container);
    }
  }

  clickNextHandler(slide: HTMLDivElement, container: HTMLDivElement) {
    const amount: number | undefined = this.product?.images.length;
    const sizeWindow = document.documentElement.getBoundingClientRect().width;
    if (amount !== undefined && this.currentSlide < amount - 3) {
      this.currentSlide++;
      if (sizeWindow > 767) {
        this.shift = this.currentSlide * (slide.clientHeight + 20);
        container.style.transform = `translateY(-${this.shift}px)`;
      } else {
        this.shift = this.currentSlide * (slide.clientWidth + 20);
        container.style.transform = `translateX(-${this.shift}px)`;
      }
      container.dataset.slide = this.currentSlide.toString();
    }
  }

  clickPrevHandler(slide: HTMLDivElement, container: HTMLDivElement) {
    const sizeWindow = document.documentElement.getBoundingClientRect().width;
    if (this.currentSlide > 0) {
      this.currentSlide--;
      if (sizeWindow > 767) {
        this.shift = this.currentSlide * (slide.clientHeight + 20);
        container.style.transform = `translateY(-${this.shift}px)`;
      } else {
        this.shift = this.currentSlide * (slide.clientWidth + 20);
        container.style.transform = `translateX(-${this.shift}px)`;
      }
      container.dataset.slide = this.currentSlide.toString();
    }
  }

  createProductDefinition() {
    const container: HTMLDivElement = new Component('div', [style.product_definition]).getElement<HTMLDivElement>();
    const name: HTMLHeadingElement = new Component('h3', [style.product_name]).getElement<HTMLHeadingElement>();
    isNull(this.product);
    name.textContent = this.product?.name;
    const textDefinition: HTMLDivElement = new Component('div', [
      style.product_text_definition,
    ]).getElement<HTMLDivElement>();
    textDefinition.textContent = this.product.definition;
    container.append(
      name,
      this.createPriceContainer(),
      textDefinition,
      this.createColorsSelect(),
      this.createSizeSelect(),
      this.createCartButton()
    );
    return container;
  }

  createPriceContainer() {
    const container: HTMLDivElement = new Component('div', [style.price_container]).getElement<HTMLDivElement>();
    const currentPrice: HTMLDivElement = new Component('div', [style.current_price]).getElement<HTMLDivElement>();
    const allPrice: HTMLDivElement = new Component('div', [style.all_price]).getElement<HTMLDivElement>();
    const discountContainer: HTMLDivElement = new Component('div', [
      style.discount_container,
    ]).getElement<HTMLDivElement>();
    const discountText: HTMLSpanElement = new Component('div', [style.discount_text]).getElement<HTMLDivElement>();
    if (this.product?.discount !== '') {
      allPrice.textContent = `$${this.product?.price}`;
      currentPrice.textContent = `$${Number(this.product?.price) * (1 - Number(this.product?.discount))}`;
      discountText.textContent = `-${Number(this.product?.discount) * 100}%`;
      discountContainer.append(discountText);
      container.append(currentPrice, allPrice, discountContainer);
    } else {
      currentPrice.textContent = `$${this.product.price}`;
      container.append(currentPrice);
    }
    return container;
  }

  createPathChain() {
    const chainContainer: HTMLDivElement = new Component('div', [style.chain_container]).getElement<HTMLDivElement>();
    const browserAdress: string = window.location.pathname;
    console.log(window.location.pathname);
    const chainArray = [...browserAdress.split('/').slice(0, -1)];
    console.log(chainArray);
    chainArray.forEach((chain, index) => {
      if (index < chainArray.length - 1) {
        if (chain === '') {
          chainContainer.append(this.createChainLink('main', 'main', true));
        } else {
          chainContainer.append(this.createChainLink(chain, chainArray.slice(0, index).join('/'), true));
        }
      }
    });
    chainContainer.append(
      this.createChainLink(
        chainArray[chainArray.length - 1],
        chainArray.slice(0, chainArray.length - 1).join('/'),
        false
      )
    );
    return chainContainer;
  }

  createChainLink(nameLink: string, path: string, label: boolean) {
    const container: HTMLDivElement = new Component('div', [style.chain_link_container]).getElement<HTMLDivElement>();
    const link: HTMLAnchorElement = new Component('a', [style.chain_link]).getElement<HTMLAnchorElement>();
    link.textContent = nameLink.at(0)?.toUpperCase() + nameLink.slice(1);
    link.setAttribute('href', `/${path}`);
    const vectorElem: HTMLSpanElement = new Component('span', [style.chain_symbol_to]).getElement<HTMLSpanElement>();
    if (label) {
      vectorElem.textContent = '>';
    } else {
      link.style.color = 'black';
    }
    container.append(link, vectorElem);
    return container;
  }

  createColorsSelect() {
    const colorsContainer: HTMLDivElement = new Component('div', [style.product_colors]).getElement<HTMLDivElement>();
    const colorName: HTMLDivElement = new Component('div', [style.product_colors_name]).getElement<HTMLDivElement>();
    colorName.textContent = 'Select Colors';
    const colorSelectContainer: HTMLDivElement = new Component('div', [
      style.product_select_colors,
    ]).getElement<HTMLDivElement>();
    this.product?.colors.forEach((color, index) => {
      const colorBox: HTMLDivElement = new Component('div', [style.color_box]).getElement<HTMLDivElement>();
      const checkBox: HTMLDivElement = new Component('div', [style.color_checkbox]).getElement<HTMLDivElement>();
      colorBox.dataset.color = color;
      colorBox.style.backgroundColor = color;
      colorBox.append(checkBox);
      if (index === 0) {
        colorBox.classList.add(style.active_colorBox);
      }
      colorBox.addEventListener('click', (event) => this.clickColorHandler(event, colorSelectContainer));
      colorSelectContainer.append(colorBox);
    });
    colorsContainer.append(colorName, colorSelectContainer);
    return colorsContainer;
  }

  clickColorHandler(event: Event, container: HTMLDivElement) {
    const elem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
    const pastActiveElem: HTMLButtonElement | null = container.querySelector(`.${style.active_colorBox}`);
    isNull(pastActiveElem);
    pastActiveElem.classList.remove(style.active_colorBox);
    elem.classList.add(style.active_colorBox);
  }

  createSizeSelect() {
    const sizesContainer: HTMLDivElement = new Component('div', [style.product_sizes]).getElement<HTMLDivElement>();
    const sizeName: HTMLDivElement = new Component('div', [style.product_sizes_name]).getElement<HTMLDivElement>();
    sizeName.textContent = 'Choose Size';
    const sizeSelectContainer: HTMLDivElement = new Component('div', [
      style.product_select_sizes,
    ]).getElement<HTMLDivElement>();
    this.product?.sizes.forEach((size, index) => {
      const sizeBox: HTMLButtonElement = new Component('button', [style.size_box]).getElement<HTMLButtonElement>();
      sizeBox.textContent = size.at(0)?.toUpperCase() + size.slice(1);
      sizeBox.dataset.size = size;
      if (index === 0) {
        sizeBox.classList.add(style.active_sizebox);
      }
      sizeSelectContainer.append(sizeBox);
    });
    sizesContainer.addEventListener('click', (event) => this.clickSizeboxHandler(event, sizesContainer));
    sizesContainer.append(sizeName, sizeSelectContainer);
    return sizesContainer;
  }

  clickSizeboxHandler(event: Event, container: HTMLDivElement) {
    const elem: HTMLButtonElement = <HTMLButtonElement>event.target;
    const pastActiveElem: HTMLButtonElement | null = container.querySelector(`.${style.active_sizebox}`);
    isNull(pastActiveElem);
    pastActiveElem.classList.remove(style.active_sizebox);
    elem.classList.add(style.active_sizebox);
  }

  createCartButton() {
    const container: HTMLDivElement = new Component('div', [
      style.product_button_container,
    ]).getElement<HTMLDivElement>();
    const amountContainer: HTMLDivElement = new Component('div', [
      style.cart_amount_container,
    ]).getElement<HTMLDivElement>();
    const amount: HTMLSpanElement = new Component('span', ['product_amount']).getElement<HTMLSpanElement>();
    amount.textContent = '1';
    const minus: HTMLSpanElement = new Component('span', [style.minus_amount]).getElement<HTMLSpanElement>();
    minus.textContent = '-';
    minus.addEventListener('click', () => this.substractAmount(amount));
    const plus: HTMLSpanElement = new Component('span', [style.plus_amount]).getElement<HTMLSpanElement>();
    plus.textContent = '+';
    plus.addEventListener('click', () => this.addAmount(amount));
    amountContainer.append(minus, amount, plus);
    const addToCartButton: HTMLButtonElement = new Component('button', [
      style.add_to_cart_button,
    ]).getElement<HTMLButtonElement>();
    addToCartButton.textContent = 'Add to Cart';
    container.append(amountContainer, addToCartButton);
    return container;
  }

  addAmount(amount: HTMLSpanElement) {
    let numberAmount: number = Number(amount.textContent);
    numberAmount++;
    amount.textContent = numberAmount.toString();
  }

  substractAmount(amount: HTMLSpanElement) {
    let numberAmount: number = Number(amount.textContent);
    if (numberAmount !== 0) {
      numberAmount--;
      amount.textContent = numberAmount.toString();
    }
  }
}

window.addEventListener('resize', () => {
  const slider: HTMLDivElement | null = document.querySelector(`.${style.small_imgs_container}`);
  const sizeWindow = document.documentElement.getBoundingClientRect().width;
  if (slider !== null) {
    const slide: HTMLDivElement | null = document.querySelector(`.${style.small_img}`);
    if (slide !== null) {
      if (sizeWindow > 767) {
        console.log(slider.dataset.slide);
        slider.style.transform = `translateX(0px)`;
        const shift: number = (slide?.clientHeight + 20) * Number(slider.dataset.slide);
        slider.style.transform = `translateY(-${shift}px)`;
      } else {
        slider.style.transform = `translateY(0px)`;
        const shift: number = (slide?.clientWidth + 20) * Number(slider.dataset.slide);
        slider.style.transform = `translateX(-${shift}px)`;
      }
    }
  }
});
