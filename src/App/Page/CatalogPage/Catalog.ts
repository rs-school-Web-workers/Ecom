import Component from '../../utils/base-component';
import mydata from '../../../assets/data/mydata.json';
import Page from '../Page';
import * as catalogStyle from './catalog.module.scss';
import loki from '../../../assets/imgs/loki.webp';
import { CardItem } from './types';
const {
  catalog,
  catalog__headerTitle,
  catalog__listProducts,
  catalogContainerFilters,
  catalogContainerProducts,
  catalog__card,
  catalog__cardImg,
  catalog__cardName,
  catalog__cardDescription,
  catalog__wrapperAbout,
  catalog__cardPriceContainer,
  catalog__cardPrice,
  catalog__cardPrice_dashedGrey,
} = catalogStyle;
export class CatalogPage extends Page {
  containerFilters = new Component('div', [catalogContainerFilters]);
  containerProducts = new Component('div', [catalogContainerProducts]);
  listProductsContainer = new Component('div', [catalog__listProducts]);
  titleContainerProducts = new Component('h1', [catalog__headerTitle]);
  constructor() {
    super([catalog]);
    this.createCardList();
    this.render();
  }
  render() {
    this.setTitleContainerProducts();
    this.containerProducts.setChildren(
      this.titleContainerProducts.getElement(),
      this.listProductsContainer.getElement()
    );
    this.container?.append(this.containerFilters.getElement(), this.containerProducts.getElement());
  }

  setTitleContainerProducts(text: string = 'Casual') {
    this.titleContainerProducts.setTextContent(text);
  }

  createCardList() {
    mydata.casual[0]['t-shirt']?.forEach(({ brand, name, description, price, image }) => {
      const dataObject: CardItem = {
        name: `${brand} ${name}`,
        description,
        priceWithDiscount: price,
        priceWithoutDiscount: price,
        imageLink: loki,
      };
      console.log(image);
      const card = this.createCard(dataObject);
      this.listProductsContainer.setChildren(card.getElement());
    });
  }
  createCard(data: CardItem) {
    const card = new Component('div', [catalog__card]);
    const imageCard = new Component('img', [catalog__cardImg]);
    console.log(data);
    imageCard.getElement<HTMLImageElement>().src = `${data.imageLink}`;
    imageCard.getElement<HTMLImageElement>().alt = data.name;
    const titleCard = new Component('h3', [catalog__cardName]);
    titleCard.setTextContent(data.name);
    const descriptionCard = new Component('p', [catalog__cardDescription]);
    descriptionCard.setTextContent(data.description);
    const priceWithDiscount = new Component('span', [catalog__cardPrice]);
    priceWithDiscount.setTextContent(data.priceWithDiscount);
    const priceWithoutDiscount = new Component('span', [catalog__cardPrice, catalog__cardPrice_dashedGrey]);
    priceWithoutDiscount.setTextContent(data.priceWithoutDiscount);
    const containerForCardPrices = new Component('div', [catalog__cardPriceContainer]);
    containerForCardPrices.setChildren(priceWithDiscount.getElement(), priceWithoutDiscount.getElement());
    const wrapperAboutCard = new Component('div', [catalog__wrapperAbout]);
    wrapperAboutCard.setChildren(
      titleCard.getElement(),
      descriptionCard.getElement(),
      containerForCardPrices.getElement()
    );
    card.setChildren(imageCard.getElement<HTMLImageElement>(), wrapperAboutCard.getElement());
    // const discount = new Component('div', ['catalog__card-discount']);
    return card;
  }
}
