import { Router } from '../../Router/Router';
import Component from '../../utils/base-component';
import Page from '../Page';
import * as style from './product.module.scss';
import { IProduct } from './types';
import { isNull } from '../../utils/base-methods';
import { ProductModal } from '../../Modal/ProductModal/ProductModal';
import { getCart, getClient, getProductById } from '../../utils/api/Client';
import type { Variant } from './types';
import { PagePath } from '../../Router/types';
import cartLogo from '../../../assets/imgs/car_logo_30.png';
export default class ProductPage extends Page {
  router: Router;

  currentSlide: number = 0;

  shift: number = 0;

  startTouch: number = 0;

  modal: ProductModal | null;
  info: { name?: string; definition?: string } = {};
  variants: Variant[] = [];
  index = 0;
  products: IProduct[] = [];
  colors: string[] = [];

  imagesContainer: HTMLDivElement = new Component('div', [style.img_container]).getElement<HTMLDivElement>();

  sizeContainer: HTMLDivElement = new Component('div', [style.product_sizes]).getElement<HTMLDivElement>();

  priceContainer: HTMLDivElement = new Component('div', [style.price_container]).getElement<HTMLDivElement>();
  amountContainer: HTMLDivElement | undefined;
  cartButtonText: HTMLSpanElement | undefined;
  amount: HTMLSpanElement | undefined;

  constructor(router: Router, id: string) {
    super([style.product]);
    this.router = router;
    this.modal = null;
    this.initProductInfo(id).then(() => this.createProductDetail(id));
  }

  async initProductInfo(id: string) {
    try {
      const response = await getProductById(id);
      this.colors = [response.body.masterData.current.masterVariant]
        .concat(response.body.masterData.current.variants)
        .map((el) => {
          return el.attributes?.filter((attr) => attr.name === 'color')[0].value[0];
        });
      this.info = {
        name: response.body.masterData.current.name['en-US'],
        definition: response.body.masterData.current.description!['en-US'],
      };
      this.variants = [response.body.masterData.current.masterVariant]
        .concat(response.body.masterData.current.variants)
        .map((el) => {
          const res: Variant = {
            id: el.id,
            color: el.attributes?.filter((attr) => attr.name === 'color')[0].value[0],
            price: el.prices![0].value.centAmount,
            brand: el.attributes?.filter((attr) => attr.name === 'brand')[0].value,
            images: el.images?.map((img) => img.url) ?? [],
            sizes: el.attributes?.filter((attr) => attr.name === 'size')[0].value,
          };
          if (el.prices![0].discounted) {
            res.discounted = el.prices![0].discounted?.value.centAmount;
          }
          return res;
        });
      this.products = this.variants.map((el) => {
        return {
          id: el.id,
          name: this.info.name!,
          price: el.price.toString(),
          discount: el.discounted ? ((el.discounted * 100) / el.price).toString() : '',
          definition: this.info.definition!,
          colors: [el.color],
          sizes: el.sizes,
          images: el.images,
          brand: el.brand,
        };
      });
    } catch {
      this.router.navigate(PagePath.NOT_FOUND);
      this.router.renderPageView(PagePath.NOT_FOUND);
    }
  }

  renderProductPage() {
    this.createSizeSelect();
    this.createImgContainer();
    this.createPriceContainer();
    if (this.variants[this.index] != null) {
      this.modal = new ProductModal('product', this.variants[this.index].images);
      this.container?.append(this.modal.background);
    }
  }
  createProductDetail(id: string) {
    const container: HTMLDivElement = new Component('div', [style.product_detail]).getElement<HTMLDivElement>();
    const infoContainer: HTMLDivElement = new Component('div', [style.product_info]).getElement<HTMLDivElement>();
    infoContainer.append(this.imagesContainer, this.createProductDefinition(id));
    container.append(this.createPathChain(), infoContainer);
    this.container?.append(container);
  }

  createImgContainer() {
    this.imagesContainer.replaceChildren();
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
    if (this.variants[this.index] != null && this.variants[this.index].images.length > 3) {
      scrollContainer.append(arrow_left, arrow_right);
    }
    mainImgContainer.src = `${this.variants[this.index].images[0]}`;
    this.variants[this.index].images.forEach((img, index) => {
      const imgContainer: HTMLDivElement = new Component('div', [style.small_img]).getElement<HTMLDivElement>();
      const imgBox: HTMLImageElement = new Component('img', []).getElement<HTMLImageElement>();
      imgBox.dataset.slide = (index + 1).toString();
      imgBox.src = `${img}`;
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
    mainImgContainer.addEventListener('click', () => this.clickMainImgHandler());
    scrollContainer.append(smallImgsContainer);
    this.imagesContainer.append(scrollContainer, mainImgContainer);
  }

  clickMainImgHandler() {
    this.modal?.modalShow();
  }

  clickSmallImgHandler(event: Event, mainImg: HTMLImageElement, container: HTMLDivElement) {
    const elem: HTMLImageElement = <HTMLImageElement>event.target;
    this.modal?.swiper?.slideTo(Number(elem.dataset.slide) - 1);
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
    const amount: number | undefined = this.variants[this.index].images.length;
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

  createProductDefinition(id: string) {
    const container: HTMLDivElement = new Component('div', [style.product_definition]).getElement<HTMLDivElement>();
    const name: HTMLHeadingElement = new Component('h3', [style.product_name]).getElement<HTMLHeadingElement>();
    if (this.variants[this.index] != null) {
      name.textContent = this.info.name ?? 'error';
      const brand: HTMLDivElement = new Component('div', [style.product_brand]).getElement<HTMLDivElement>();
      brand.textContent = this.variants[this.index].brand;
      const textDefinition: HTMLDivElement = new Component('div', [
        style.product_text_definition,
      ]).getElement<HTMLDivElement>();
      textDefinition.textContent = this.info.definition ?? 'error';
      container.append(
        name,
        brand,
        this.priceContainer,
        textDefinition,
        this.createColorsSelect(id),
        this.sizeContainer,
        this.createCartButton(id)
      );
      this.renderProductPage();
    }
    return container;
  }

  createPriceContainer() {
    this.priceContainer.replaceChildren();
    const currentPrice: HTMLDivElement = new Component('div', [style.current_price]).getElement<HTMLDivElement>();
    const allPrice: HTMLDivElement = new Component('div', [style.all_price]).getElement<HTMLDivElement>();
    const discountContainer: HTMLDivElement = new Component('div', [
      style.discount_container,
    ]).getElement<HTMLDivElement>();
    const discountText: HTMLSpanElement = new Component('div', [style.discount_text]).getElement<HTMLDivElement>();
    if (this.variants[this.index].discounted) {
      allPrice.textContent = `$${(Number(this.variants[this.index].price) / 100).toFixed(2)}`;
      currentPrice.textContent = `$${(Number(this.variants[this.index].discounted) / 100).toFixed(2)}`;
      discountText.textContent = `-${Math.ceil(Number(this.variants[this.index].discounted) * 100) / Number(this.variants[this.index].price)}%`;
      discountContainer.append(discountText);
      this.priceContainer.append(currentPrice, allPrice, discountContainer);
    } else {
      currentPrice.textContent = `$${(Number(this.variants[this.index].price) / 100).toFixed(2)}`;
      this.priceContainer.append(currentPrice);
    }
  }

  createPathChain() {
    const chainContainer: HTMLDivElement = new Component('div', [style.chain_container]).getElement<HTMLDivElement>();
    const browserAdress: string = window.location.pathname;
    const chainArray = [...browserAdress.split('/').slice(0, -1)];
    chainArray.forEach((chain, index) => {
      if (index < chainArray.length - 1) {
        if (chain === '') {
          chainContainer.append(this.createChainLink('main', 'main', true));
        } else {
          chainContainer.append(this.createChainLink(chain, chainArray.slice(0, index + 1).join('/'), true));
        }
      }
    });
    chainContainer.append(
      this.createChainLink(chainArray[chainArray.length - 1], chainArray.slice(0, chainArray.length).join('/'), false)
    );
    return chainContainer;
  }

  createChainLink(nameLink: string, path: string, label: boolean) {
    const container: HTMLDivElement = new Component('div', [style.chain_link_container]).getElement<HTMLDivElement>();
    const link: HTMLAnchorElement = new Component('a', [style.chain_link]).getElement<HTMLAnchorElement>();
    link.addEventListener('click', (event) => this.clickLinkHandler(event));
    link.textContent = nameLink.at(0)?.toUpperCase() + nameLink.slice(1);
    link.setAttribute('href', `${path}`);
    const vectorElem: HTMLSpanElement = new Component('span', [style.chain_symbol_to]).getElement<HTMLSpanElement>();
    if (label) {
      vectorElem.textContent = '>';
    } else {
      link.style.color = 'black';
    }
    container.append(link, vectorElem);
    return container;
  }

  clickLinkHandler(event: Event) {
    event.preventDefault();
    const elem: HTMLAnchorElement = <HTMLAnchorElement>event.currentTarget;
    const link: string = '/' + elem.href.split('/').slice(3).join('/');
    this.router.navigate(link);
    this.router.renderPageView(link);
  }

  createColorsSelect(id: string) {
    const colorsContainer: HTMLDivElement = new Component('div', [style.product_colors]).getElement<HTMLDivElement>();
    const colorName: HTMLDivElement = new Component('div', [style.product_colors_name]).getElement<HTMLDivElement>();
    colorName.textContent = 'Select Colors';
    const colorSelectContainer: HTMLDivElement = new Component('div', [
      style.product_select_colors,
    ]).getElement<HTMLDivElement>();
    this.colors.forEach((color, index) => {
      const colorBox: HTMLDivElement = new Component('div', [style.color_box]).getElement<HTMLDivElement>();
      const checkBox: HTMLDivElement = new Component('div', [style.color_checkbox]).getElement<HTMLDivElement>();
      colorBox.dataset.color = color;
      colorBox.dataset.id = index.toString();
      colorBox.style.backgroundColor = color;
      colorBox.append(checkBox);
      if (index === 0) {
        colorBox.classList.add(style.active_colorBox);
      }
      colorBox.addEventListener('click', (event) => {
        this.clickColorHandler(event, colorSelectContainer);
        this.updateButton(id);
      });
      colorSelectContainer.append(colorBox);
    });
    colorsContainer.append(colorName, colorSelectContainer);
    return colorsContainer;
  }

  clickColorHandler(event: Event, container: HTMLDivElement) {
    const elem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
    const pastActiveElem: HTMLButtonElement | null = container.querySelector(`.${style.active_colorBox}`);
    if (pastActiveElem !== null) {
      pastActiveElem.classList.remove(style.active_colorBox);
    }
    elem.classList.add(style.active_colorBox);
    this.index = Number(elem.dataset.id);
    this.renderProductPage();
  }

  createSizeSelect() {
    this.sizeContainer.replaceChildren();
    const sizeName: HTMLDivElement = new Component('div', [style.product_sizes_name]).getElement<HTMLDivElement>();
    sizeName.textContent = 'Choose Size';
    const sizeSelectContainer: HTMLDivElement = new Component('div', [
      style.product_select_sizes,
    ]).getElement<HTMLDivElement>();
    this.variants[this.index].sizes.forEach((size, index) => {
      const sizeBox: HTMLButtonElement = new Component('button', [style.size_box]).getElement<HTMLButtonElement>();
      sizeBox.textContent = size.at(0)?.toUpperCase() + size.slice(1);
      sizeBox.dataset.size = size;
      if (index === 0) {
        sizeBox.classList.add(style.active_sizebox);
      }
      sizeBox.addEventListener('click', (event) => this.clickSizeboxHandler(event, this.sizeContainer));
      sizeSelectContainer.append(sizeBox);
    });
    this.sizeContainer.append(sizeName, sizeSelectContainer);
  }

  clickSizeboxHandler(event: Event, container: HTMLDivElement) {
    const elem: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
    const pastActiveElem: HTMLButtonElement | null = container.querySelector(`.${style.active_sizebox}`);
    if (pastActiveElem !== null) {
      pastActiveElem.classList.remove(style.active_sizebox);
    }
    elem.classList.add(style.active_sizebox);
  }

  createCartButton(id: string) {
    const container: HTMLDivElement = new Component('div', [
      style.product_button_container,
    ]).getElement<HTMLDivElement>();
    const amountContainer: HTMLDivElement = new Component('div', [
      style.cart_amount_container,
    ]).getElement<HTMLDivElement>();
    const amount: HTMLSpanElement = new Component('span', ['product_amount']).getElement<HTMLSpanElement>();
    amount.textContent = '1';
    this.amount = amount;
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
    const cartButtonText: HTMLSpanElement = new Component('span', [
      style.cart_button_text,
    ]).getElement<HTMLSpanElement>();
    const cartButtonImg: HTMLImageElement = new Component('img', ['cart_button_img']).getElement<HTMLImageElement>();
    cartButtonImg.src = cartLogo;
    addToCartButton.append(cartButtonText, cartButtonImg);
    this.amountContainer = amountContainer;
    this.cartButtonText = cartButtonText;
    this.updateButton(id);
    addToCartButton.addEventListener('click', async () => {
      const cart = await getCart();
      if (this.amountContainer!.classList.contains(style.disabled_amount)) {
        await getClient()
          ?.me()
          .carts()
          .withId({ ID: cart!.body.id })
          .post({
            body: {
              version: cart!.body.version,
              actions: [
                {
                  action: 'removeLineItem',
                  lineItemId: cart!.body.lineItems.filter(
                    (el) => el.productId === id && el.variant.id === this.variants[this.index].id
                  )[0].id,
                },
              ],
            },
          })
          .execute();
        this.cartButtonText!.textContent = 'Add to Cart';
        this.amountContainer!.classList.remove(style.disabled_amount);
        this.amount!.textContent = '1';
      } else {
        const variantId = this.variants[this.index].id;
        await getClient()
          ?.me()
          .carts()
          .withId({ ID: cart!.body.id })
          .post({
            body: {
              version: cart!.body.version,
              actions: [
                {
                  action: 'addLineItem',
                  productId: id,
                  variantId: variantId,
                  quantity: Number(this.amount!.textContent),
                },
              ],
            },
          })
          .execute();
        this.cartButtonText!.textContent = 'Remove from Cart';
        this.amountContainer!.classList.add(style.disabled_amount);
      }
    });
    container.append(amountContainer, addToCartButton);
    return container;
  }

  async updateButton(id: string) {
    const cart = await getCart();
    const stateProduct =
      cart?.body.lineItems.filter((el) => el.productId === id && el.variant.id === this.variants[this.index].id)
        .length ?? 1 > 0;
    if (stateProduct) {
      this.cartButtonText!.textContent = 'Remove from Cart';
      this.amountContainer!.classList.add(style.disabled_amount);
    } else {
      this.cartButtonText!.textContent = 'Add to Cart';
      this.amountContainer!.classList.remove(style.disabled_amount);
    }
  }

  addAmount(amount: HTMLSpanElement) {
    let numberAmount: number = Number(amount.textContent);
    numberAmount++;
    amount.textContent = numberAmount.toString();
  }

  substractAmount(amount: HTMLSpanElement) {
    let numberAmount: number = Number(amount.textContent);
    if (numberAmount !== 1) {
      numberAmount--;
      amount.textContent = numberAmount.toString();
    }
  }

  cartButtonHandler(event: Event, amountContainer: HTMLDivElement, amount: HTMLSpanElement) {
    const button: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
    const buttonText: HTMLSpanElement | null = button.querySelector<HTMLSpanElement>(`.${style.cart_button_text}`);
    if (buttonText !== null) {
      // проверка наличия в корзине
      const stateProduct: boolean = false;
      if (stateProduct) {
        buttonText.textContent = 'Add to Cart';
        amountContainer.classList.remove(style.disabled_amount);
        amount.textContent = '1';
        // удаление из корзины
      } else {
        if (amount.textContent !== '0') {
          buttonText.textContent = 'Remove from Cart';
          amountContainer.classList.add(style.disabled_amount);
          // добавление в корзину
        }
      }
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
