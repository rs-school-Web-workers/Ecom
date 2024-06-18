import Component from '../../utils/base-component';
import Page from '../Page';
import * as basketPageStyles from './basket.module.scss';
import photo from '../../../assets/imgs/abs.png';
import { getCart, getClient, getUserProfile, isLogged } from '../../utils/api/Client';
import { centsToDollar } from '../../utils/helpers';
import { Router } from '../../Router/Router';

const {
  basket,
  basketWrapper,
  basketTitle,
  basketContainer,
  basketContainer_scroll,
  basketCard,
  basketCardContainer,
  basketCardContainer_attributes,
  basketCardContainer_count,
  basketCardImg,
  basketText_name,
  basketText_sub_grey,
  basketCardButton,
  basketCardButton_trash,
  basketCardButtonContainer,
  basketOrder,
  basketOrderTitle,
  basketOrderSubtitle,
  basketOrderSubtitle_price,
  basketOrderSubtitle_discount,
  basketOrderInlineFlex,
  basketOrderInlineFlex_promo,
  basketOrderInputWrapper,
  basketOrderInput,
  basketOrderButton,
  basketOrderButton_promoApply,
  basketEmptyCardMessage,
  basketEmptyTitle,
  basketEmptyText,
  basketEmptyLink,
} = basketPageStyles;

export class BasketPage extends Page {
  private title = new Component('h1', [basketTitle]);
  private cardContainer = new Component('div', [basketContainer, basketContainer_scroll]);
  private orderContainer = new Component('div', [basketContainer, basketOrder]);
  private router: Router;
  constructor(router: Router) {
    super([basket]);
    this.router = router;
    this.init();
  }

  private async init() {
    this.title.setTextContent('Your Cart');
    const wrapper = new Component('div', [basketWrapper]);
    this.createCardProducts();
    wrapper.setChildren(
      this.cardContainer.getElement<HTMLDivElement>(),
      this.orderContainer.getElement<HTMLDivElement>()
    );
    this.container?.append(this.title.getElement(), wrapper.getElement());
  }

  async createCardProducts() {
    // запрос на товары в корзине
    const cart = await getCart();
    if (!cart || cart.body.lineItems.length === 0) {
      // no items in the cart message
      this.createEmptyMessage();
    } else {
      cart.body.lineItems.forEach((item) => {
        // item.productId и item.variant.id, чтобы найти конкретный продукт
        this.createCard(
          item.variant.images?.length ? item.variant.images[0].url : photo,
          item.name['en-US'],
          item.variant.attributes?.filter((attr) => attr.name === 'color')[0].value[0],
          (item.price?.discounted
            ? centsToDollar(item.price.discounted.value.centAmount)
            : centsToDollar(item.price?.value.centAmount ?? 0)
          ).concat('$'),
          item.quantity.toString(),
          item.productId,
          item.variant.id,
          item.id
        );
      });
    }
    this.createOrderAmount();
  }

  private createCard(
    img: string = photo,
    name: string,
    color: string,
    price: string,
    quantity: string,
    productId: string,
    variantId: number,
    lineItemId: string,
    size?: string
  ) {
    const SVGTRASH = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.25 3.50006H13.5V2.75006C13.5 2.15332 13.2629 1.58103 12.841 1.15907C12.419 0.737114 11.8467 0.500061 11.25 0.500061H6.75C6.15326 0.500061 5.58097 0.737114 5.15901 1.15907C4.73705 1.58103 4.5 2.15332 4.5 2.75006V3.50006H0.75C0.551088 3.50006 0.360322 3.57908 0.21967 3.71973C0.0790178 3.86038 0 4.05115 0 4.25006C0 4.44897 0.0790178 4.63974 0.21967 4.78039C0.360322 4.92104 0.551088 5.00006 0.75 5.00006H1.5V18.5001C1.5 18.8979 1.65804 19.2794 1.93934 19.5607C2.22064 19.842 2.60218 20.0001 3 20.0001H15C15.3978 20.0001 15.7794 19.842 16.0607 19.5607C16.342 19.2794 16.5 18.8979 16.5 18.5001V5.00006H17.25C17.4489 5.00006 17.6397 4.92104 17.7803 4.78039C17.921 4.63974 18 4.44897 18 4.25006C18 4.05115 17.921 3.86038 17.7803 3.71973C17.6397 3.57908 17.4489 3.50006 17.25 3.50006ZM7.5 14.7501C7.5 14.949 7.42098 15.1397 7.28033 15.2804C7.13968 15.421 6.94891 15.5001 6.75 15.5001C6.55109 15.5001 6.36032 15.421 6.21967 15.2804C6.07902 15.1397 6 14.949 6 14.7501V8.75006C6 8.55115 6.07902 8.36038 6.21967 8.21973C6.36032 8.07908 6.55109 8.00006 6.75 8.00006C6.94891 8.00006 7.13968 8.07908 7.28033 8.21973C7.42098 8.36038 7.5 8.55115 7.5 8.75006V14.7501ZM12 14.7501C12 14.949 11.921 15.1397 11.7803 15.2804C11.6397 15.421 11.4489 15.5001 11.25 15.5001C11.0511 15.5001 10.8603 15.421 10.7197 15.2804C10.579 15.1397 10.5 14.949 10.5 14.7501V8.75006C10.5 8.55115 10.579 8.36038 10.7197 8.21973C10.8603 8.07908 11.0511 8.00006 11.25 8.00006C11.4489 8.00006 11.6397 8.07908 11.7803 8.21973C11.921 8.36038 12 8.55115 12 8.75006V14.7501ZM12 3.50006H6V2.75006C6 2.55115 6.07902 2.36038 6.21967 2.21973C6.36032 2.07908 6.55109 2.00006 6.75 2.00006H11.25C11.4489 2.00006 11.6397 2.07908 11.7803 2.21973C11.921 2.36038 12 2.55115 12 2.75006V3.50006Z" fill="#FF3333"/>
</svg>`;
    const SVGMINUS = `<svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8125 1C15.8125 1.24864 15.7137 1.4871 15.5379 1.66291C15.3621 1.83873 15.1236 1.9375 14.875 1.9375H1.125C0.87636 1.9375 0.637903 1.83873 0.462087 1.66291C0.286272 1.4871 0.1875 1.24864 0.1875 1C0.1875 0.75136 0.286272 0.512903 0.462087 0.337087C0.637903 0.161272 0.87636 0.0625 1.125 0.0625H14.875C15.1236 0.0625 15.3621 0.161272 15.5379 0.337087C15.7137 0.512903 15.8125 0.75136 15.8125 1Z" fill="black"/>
</svg>
`;
    const SVGPLUS = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8125 8.00006C15.8125 8.2487 15.7137 8.48716 15.5379 8.66297C15.3621 8.83879 15.1236 8.93756 14.875 8.93756H8.9375V14.8751C8.9375 15.1237 8.83873 15.3622 8.66291 15.538C8.4871 15.7138 8.24864 15.8126 8 15.8126C7.75136 15.8126 7.5129 15.7138 7.33709 15.538C7.16127 15.3622 7.0625 15.1237 7.0625 14.8751V8.93756H1.125C0.87636 8.93756 0.637903 8.83879 0.462087 8.66297C0.286272 8.48716 0.1875 8.2487 0.1875 8.00006C0.1875 7.75142 0.286272 7.51296 0.462087 7.33715C0.637903 7.16133 0.87636 7.06256 1.125 7.06256H7.0625V1.12506C7.0625 0.876421 7.16127 0.637964 7.33709 0.462148C7.5129 0.286333 7.75136 0.187561 8 0.187561C8.24864 0.187561 8.4871 0.286333 8.66291 0.462148C8.83873 0.637964 8.9375 0.876421 8.9375 1.12506V7.06256H14.875C15.1236 7.06256 15.3621 7.16133 15.5379 7.33715C15.7137 7.51296 15.8125 7.75142 15.8125 8.00006Z" fill="black"/>
</svg>`;
    const card = new Component('div', [basketCard]);
    const containerCardLeft = new Component('div', [basketCardContainer]);
    const containerCardRight = new Component('div', [basketCardContainer, basketCardContainer_count]);
    const containerCardSizeAndColor = new Component('div', [basketCardContainer, basketCardContainer_attributes]);
    const containerCardItemAttributes = new Component('div', [basketCardContainer, basketCardContainer_attributes]);
    const itemImg = new Component('img', [basketCardImg]).getElement<HTMLImageElement>();
    itemImg.src = img;
    itemImg.alt = name;
    const itemName = new Component('h3', [basketText_name]);
    itemName.setTextContent(name);
    const itemSize = new Component('span', []);
    itemSize.getElement<HTMLSpanElement>().innerHTML = size
      ? `Size: <span class=${basketText_sub_grey}>${size}</span>`
      : '';
    const itemColor = new Component('span', []);
    itemColor.getElement<HTMLSpanElement>().innerHTML = `Color: <span class=${basketText_sub_grey}>${color}</span>`;
    const itemPrice = new Component('h2', []);
    itemPrice.setTextContent(price);
    containerCardSizeAndColor.setChildren(itemSize.getElement(), itemColor.getElement());
    containerCardItemAttributes.setChildren(
      itemName.getElement(),
      containerCardSizeAndColor.getElement(),
      itemPrice.getElement()
    );
    const buttonDeleteCard = new Component('button', [
      basketCardButton,
      basketCardButton_trash,
    ]).getElement<HTMLButtonElement>();
    buttonDeleteCard.type = 'button';
    buttonDeleteCard.innerHTML = SVGTRASH;
    buttonDeleteCard.addEventListener('click', async () => {
      buttonDeleteCard.disabled = true;
      const cart = await getCart();
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
                  (el) => el.productId === productId && el.variant.id === variantId
                )[0].id,
              },
            ],
          },
        })
        .execute();
      this.cardContainer.getElement<HTMLDivElement>().replaceChildren();
      this.orderContainer.getElement<HTMLDivElement>().replaceChildren();
      this.createCardProducts();
      buttonDeleteCard.disabled = false;
    });
    const amountContainer = new Component('div', [basketCardButtonContainer]);
    const buttonMinusItem = new Component('button', [basketCardButton]).getElement<HTMLButtonElement>();
    buttonMinusItem.type = 'button';
    buttonMinusItem.innerHTML = SVGMINUS;
    const buttonPlusItem = new Component('button', [basketCardButton]).getElement<HTMLButtonElement>();
    buttonPlusItem.type = 'button';
    buttonPlusItem.innerHTML = SVGPLUS;
    const amount = new Component('span', []);
    amount.setTextContent(quantity);
    buttonMinusItem.addEventListener('click', async () => {
      buttonMinusItem.disabled = true;
      const cart = await getCart();
      if (Number(amount.getElement<HTMLElement>().textContent) - 1 < 1) {
        card.getElement<HTMLElement>().remove();
        if (cart?.body.totalLineItemQuantity === 1) {
          this.createEmptyMessage();
        }
      }
      amount.getElement<HTMLElement>().textContent = (
        Number(amount.getElement<HTMLElement>().textContent) - 1
      ).toString();
      await getClient()
        ?.me()
        .carts()
        .withId({ ID: cart!.body.id })
        .post({
          body: { actions: [{ action: 'removeLineItem', quantity: 1, lineItemId }], version: cart!.body.version },
        })
        .execute();
      this.orderContainer.getElement<HTMLDivElement>().replaceChildren();
      this.createOrderAmount();
      buttonMinusItem.disabled = false;
    });
    buttonPlusItem.addEventListener('click', async () => {
      buttonPlusItem.disabled = true;
      const cart = await getCart();
      amount.getElement<HTMLElement>().textContent = (
        Number(amount.getElement<HTMLElement>().textContent) + 1
      ).toString();
      await getClient()
        ?.me()
        .carts()
        .withId({ ID: cart!.body.id })
        .post({
          body: {
            actions: [{ action: 'addLineItem', quantity: 1, productId, variantId }],
            version: cart!.body.version,
          },
        })
        .execute();
      this.orderContainer.getElement<HTMLDivElement>().replaceChildren();
      this.createOrderAmount();
      buttonPlusItem.disabled = false;
    });
    amountContainer.setChildren(buttonMinusItem, amount.getElement(), buttonPlusItem);
    containerCardRight.setChildren(buttonDeleteCard, amountContainer.getElement());
    containerCardLeft.setChildren(itemImg, containerCardItemAttributes.getElement());
    card.setChildren(containerCardLeft.getElement(), containerCardRight.getElement());
    this.cardContainer.getElement<HTMLDivElement>().append(card.getElement());
  }

  private createOrderAmount() {
    const wrapperFullPrice = new Component('div', [basketOrderInlineFlex]);
    const titleFullPrice = new Component('span', [basketOrderSubtitle, basketText_sub_grey]);
    titleFullPrice.setTextContent('Subtotal');
    const textFullPrice = new Component('span', [basketOrderSubtitle, basketOrderSubtitle_price]);
    textFullPrice.setTextContent('0');
    wrapperFullPrice.setChildren(titleFullPrice.getElement(), textFullPrice.getElement());

    const wrapperDiscount = new Component('div', [basketOrderInlineFlex]);
    const titleDiscount = new Component('span', [basketOrderSubtitle, basketText_sub_grey]);
    titleDiscount.setTextContent('0');
    const textDiscount = new Component('span', [
      basketOrderSubtitle,
      basketOrderSubtitle_price,
      basketOrderSubtitle_discount,
    ]);
    textDiscount.setTextContent('0');
    wrapperDiscount.setChildren(titleDiscount.getElement(), textDiscount.getElement());

    /* const wrapperDeliveryFee = new Component('div', [basketOrderInlineFlex]);
    const titleDeliveryFee = new Component('span', [basketOrderSubtitle, basketText_sub_grey]);
    titleDeliveryFee.setTextContent('Delivery Fee');
    const textDeliveryFee = new Component('span', [basketOrderSubtitle, basketOrderSubtitle_price]);
    textDeliveryFee.setTextContent('$15');
    wrapperDeliveryFee.setChildren(titleDeliveryFee.getElement(), textDeliveryFee.getElement()); */

    const wrapperTotalPrice = new Component('div', [basketOrderInlineFlex]);
    const titleTotalPrice = new Component('span', [basketOrderSubtitle]);
    titleTotalPrice.setTextContent('Total');
    const textTotalPrice = new Component('h2', []);
    textTotalPrice.setTextContent('0');
    wrapperTotalPrice.setChildren(titleTotalPrice.getElement(), textTotalPrice.getElement());

    getCart().then((cart) => {
      const discountCents = cart!.body.discountOnTotalPrice?.discountedAmount.centAmount ?? 0;
      const totalCents = cart!.body.totalPrice.centAmount;
      const subTotalCents = totalCents + discountCents;
      const fullPrice: string = centsToDollar(subTotalCents).concat('$');
      const discount: string = `-${centsToDollar(discountCents)}$`;
      const total = centsToDollar(totalCents).concat('$');
      textFullPrice.setTextContent(`$${fullPrice}`);
      titleDiscount.setTextContent(
        `Discount (${Math.ceil(totalCents !== 0 ? (discountCents / totalCents) * 100 : 0)}%)`
      );
      textTotalPrice.setTextContent(total);
      textDiscount.setTextContent(`$${discount}`);
    });

    const wrapperPromo = new Component('div', [basketOrderInlineFlex, basketOrderInlineFlex_promo]);
    const wrapperInput = new Component('div', [basketOrderInputWrapper]);
    const inputPromo = new Component('input', [basketOrderInput]);
    wrapperInput.setChildren(inputPromo.getElement<HTMLInputElement>());
    inputPromo.getElement<HTMLInputElement>().type = 'text';
    inputPromo.getElement<HTMLInputElement>().placeholder = /* 'Add promo code'; */ 'TEST = -12%';
    const buttonApplyPromo = new Component('button', [basketOrderButton, basketOrderButton_promoApply]);
    buttonApplyPromo.getElement<HTMLButtonElement>().type = 'button';
    buttonApplyPromo.setTextContent('Apply');
    buttonApplyPromo.getElement<HTMLButtonElement>().addEventListener('click', async () => {
      buttonApplyPromo.getElement<HTMLButtonElement>().disabled = true;
      const cart = await getCart();
      await getClient()
        ?.me()
        .carts()
        .withId({ ID: cart!.body.id })
        .post({
          body: {
            version: cart!.body.version,
            actions: [
              {
                action: 'addDiscountCode',
                code: inputPromo.getElement<HTMLInputElement>().value,
              },
            ],
          },
        })
        .execute()
        .catch((err) => {
          // show error message
          console.log(err);
        });
      //refresh data
      this.orderContainer.getElement<HTMLDivElement>().replaceChildren();
      this.createOrderAmount();
      buttonApplyPromo.getElement<HTMLButtonElement>().disabled = false;
    });
    wrapperPromo.setChildren(wrapperInput.getElement(), buttonApplyPromo.getElement<HTMLButtonElement>());

    const buttonConfirmOrder = new Component('button', [basketOrderButton]);
    buttonConfirmOrder.getElement<HTMLButtonElement>().type = 'button';
    buttonConfirmOrder.setTextContent('Go to Checkout');
    const title = new Component('h2', [basketOrderTitle]);
    title.setTextContent('Order Summary');
    const clearContainer: HTMLDivElement = this.createClearButton();
    this.orderContainer.getElement<HTMLDivElement>().append(
      title.getElement(),
      wrapperFullPrice.getElement(),
      wrapperDiscount.getElement(),
      /* wrapperDeliveryFee.getElement(), */
      wrapperTotalPrice.getElement(),
      wrapperPromo.getElement(),
      buttonConfirmOrder.getElement<HTMLButtonElement>(),
      clearContainer
    );
  }

  createClearButton() {
    const container: HTMLDivElement = new Component('div', [
      basketPageStyles.clear_button_container,
    ]).getElement<HTMLDivElement>();
    const clearButton: HTMLButtonElement = new Component('button', [
      basketPageStyles.clear_button,
    ]).getElement<HTMLButtonElement>();
    clearButton.textContent = 'Clear Cart';
    container.append(clearButton);
    clearButton.addEventListener('click', async () => {
      clearButton.disabled = true;
      const cart = await getCart();
      if (cart?.body.lineItems.length) {
        await getClient()
          ?.me()
          .carts()
          .withId({ ID: cart!.body.id })
          .delete({ queryArgs: { version: cart!.body.version } })
          .execute();
        this.clearButtonHandler();
      }
      clearButton.disabled = true;
    });
    return container;
  }

  clearButtonHandler() {
    // удаление элементов из корзины
    this.cardContainer.getElement<HTMLDivElement>().replaceChildren();
    this.orderContainer.getElement<HTMLDivElement>().replaceChildren();
    this.createOrderAmount();
    this.createEmptyMessage();
  }

  async createEmptyMessage() {
    const wrapperMsg = new Component('div', [basketEmptyCardMessage]);
    const msgTitle = new Component('h2', [basketEmptyTitle]);
    const text = new Component('p', [basketEmptyText]);
    const link = new Component('a', [basketEmptyLink]).getElement<HTMLAnchorElement>();
    link.textContent = 'Go to products page';
    link.href = '/products';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetElem: HTMLAnchorElement | null = <HTMLAnchorElement>event.target;
      if (targetElem) {
        const navigateLink: string | null = targetElem.getAttribute('href');
        if (navigateLink) {
          this.router.navigate(navigateLink);
          this.router.renderPageView(navigateLink);
        }
      }
    });
    if (isLogged()) {
      const { firstName, lastName } = (await getUserProfile()).body;
      msgTitle.setTextContent(`Hello, ${firstName} ${lastName}`);
    } else {
      msgTitle.setTextContent('Hello, Dear Friend');
    }
    text.setTextContent(
      'Uh oh! Your cart is feeling a little lonely. Why not give it some company? Start adding products and make your cart happy again! 🛍️🙂'
    );
    wrapperMsg.setChildren(msgTitle.getElement(), text.getElement(), link);
    this.cardContainer.setChildren(wrapperMsg.getElement());
  }
}
