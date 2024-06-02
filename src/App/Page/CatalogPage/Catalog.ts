import Component from '../../utils/base-component';
import mydata from '../../../assets/data/mydata.json';
import Page from '../Page';
import * as catalogStyle from './catalog.module.scss';
import loki from '../../../assets/imgs/loki.webp';
import { CardItem, DreassSizes, DressColors, DressStyles, dresses, sortValue } from './types';
const {
  catalog,
  catalogContainer,
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
import show from '../../../assets/imgs/svg/Vector.svg';
import unshow from '../../../assets/imgs/svg/Vector2.svg';
import filter_logo from '../../../assets/imgs/svg/filter.svg';
import glass from '../../../assets/imgs/svg/glass.svg';

export class CatalogPage extends Page {
  catalogContainer = new Component('div', [catalogContainer]);
  containerFilters = new Component('div', [catalogContainerFilters]).getElement<HTMLDivElement>();
  containerProducts = new Component('div', [catalogContainerProducts]).getElement<HTMLDivElement>();
  listProductsContainer = new Component('div', [catalog__listProducts]).getElement<HTMLDivElement>();
  titleContainerProducts: HTMLHeadingElement = new Component('h1', [
    catalog__headerTitle,
  ]).getElement<HTMLHeadingElement>();
  modalBackground: HTMLDivElement = new Component('div', [catalogStyle.modal_background]).getElement<HTMLDivElement>();
  searchContainer: HTMLDivElement = new Component('div', [catalogStyle.search_container]).getElement<HTMLDivElement>();
  contentContainer: HTMLDivElement = new Component('div', [
    catalogStyle.products_content_container,
  ]).getElement<HTMLDivElement>();

  constructor() {
    super([catalog]);
    this.initCatalogPage();
    this.render();
  }

  initCatalogPage() {
    this.createHeaderCatalog();
    this.createFilterContainer();
    this.createSearchContainer();
    this.containerProducts.append(this.listProductsContainer);
    this.modalBackground.addEventListener('click', (event) => this.clickCloseFilterLogoHandler(event));
    this.contentContainer.append(this.containerFilters, this.containerProducts);
    this.container?.append(this.searchContainer, this.contentContainer, this.modalBackground);
  }

  createHeaderCatalog() {
    const container: HTMLDivElement = new Component('div', [catalogStyle.catalog_header]).getElement<HTMLDivElement>();
    const sortFilterContainer: HTMLDivElement = this.createFilterSortContainer();
    container.append(this.titleContainerProducts, sortFilterContainer);
    this.containerProducts.append(container);
  }

  createSearchContainer() {
    const searchLine: HTMLInputElement = new Component('input', [
      catalogStyle.search_products,
    ]).getElement<HTMLInputElement>();
    searchLine.type = 'search';
    searchLine.placeholder = 'Search for products...';
    const glassElem: HTMLImageElement = new Component('img', ['search_glass_elem']).getElement<HTMLImageElement>();
    glassElem.src = glass;
    searchLine.addEventListener('change', () => this.changeSearchHandler());
    this.searchContainer.append(glassElem, searchLine);
  }

  changeSearchHandler() {
    //вставить запрос и рендер
  }

  createFilterSortContainer() {
    const filter_logoMinscreen: HTMLImageElement = new Component('img', [
      catalogStyle.filter_logo_miniscreen,
    ]).getElement<HTMLImageElement>();
    filter_logoMinscreen.src = filter_logo;
    filter_logoMinscreen.addEventListener('click', () => this.clickFilterLogoHandler());
    const sortFilterContainer: HTMLDivElement = new Component('div', [
      catalogStyle.sort_filter_container,
    ]).getElement<HTMLDivElement>();
    const sortContainer: HTMLDivElement = new Component('div', [
      catalogStyle.sort_container,
    ]).getElement<HTMLDivElement>();
    const sortText: HTMLSpanElement = new Component('span', [catalogStyle.sort_text]).getElement<HTMLSpanElement>();
    sortText.textContent = 'Sort by:';
    const currentSorting: HTMLDivElement = new Component('div', [
      catalogStyle.current_sort,
    ]).getElement<HTMLDivElement>();
    const currentSortingText: HTMLSpanElement = new Component('span', [
      'current_sort_text',
    ]).getElement<HTMLSpanElement>();
    currentSortingText.textContent = sortValue[0];
    const currentSortingShow: HTMLImageElement = new Component('img', [
      catalogStyle.current_sort_show,
    ]).getElement<HTMLImageElement>();
    currentSortingShow.src = unshow;
    currentSorting.append(currentSortingText, currentSortingShow);
    sortContainer.append(sortText, currentSorting);
    const selectSortContainer: HTMLDivElement = new Component('div', [
      catalogStyle.select_sort_container,
    ]).getElement<HTMLDivElement>();
    sortValue.forEach((value) => {
      const sortElem: HTMLSpanElement = new Component('span', [catalogStyle.sort_elem]).getElement<HTMLSpanElement>();
      sortElem.textContent = value;
      sortElem.addEventListener('click', (event) =>
        this.clickSortElemHandler(event, currentSortingText, currentSortingShow, selectSortContainer)
      );
      selectSortContainer.append(sortElem);
    });
    currentSortingShow.addEventListener('click', () => this.clickShowHandler(currentSortingShow, selectSortContainer));
    sortFilterContainer.append(filter_logoMinscreen, sortContainer, selectSortContainer);
    return sortFilterContainer;
  }

  clickSortElemHandler(
    event: Event,
    currentSort: HTMLSpanElement,
    showElem: HTMLImageElement,
    container: HTMLDivElement
  ) {
    const currentElem: HTMLSpanElement = <HTMLSpanElement>event.currentTarget;
    currentSort.textContent = currentElem.textContent;
    this.clickShowHandler(showElem, container);
    //добавить сортировку элементов и рендер
  }

  clickFilterLogoHandler() {
    this.containerFilters.classList.add(catalogStyle.active_filter);
    this.modalBackground.classList.add(catalogStyle.modal_active);
  }

  clickCloseFilterLogoHandler(event: Event) {
    const elem: HTMLDivElement | null = <HTMLDivElement>event.target;
    if (elem !== null) {
      this.containerFilters.classList.remove(catalogStyle.active_filter);
      this.modalBackground.classList.remove(catalogStyle.modal_active);
    }
  }

  render() {
    this.setTitleContainerProducts();
    this.listProductsContainer.replaceChildren();
    this.createCardList();
  }

  setTitleContainerProducts(text: string = 'Casual') {
    this.titleContainerProducts.textContent = text;
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
      this.listProductsContainer.append(card.getElement());
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

  createFilterContainer() {
    const nameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.name_filter_container,
    ]).getElement<HTMLDivElement>();
    const name: HTMLSpanElement = new Component('span', [catalogStyle.name_filter]).getElement<HTMLSpanElement>();
    name.textContent = 'Filter';
    const filterLogo: HTMLImageElement = new Component('img', ['filter_logo']).getElement<HTMLImageElement>();
    filterLogo.src = filter_logo;
    nameContainer.append(name, filterLogo);
    const clothContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_cloth_container,
    ]).getElement<HTMLDivElement>();
    dresses.forEach((dress) => {
      const clothLineContainer: HTMLDivElement = new Component('div', [
        catalogStyle.filter_cloth_line_container,
      ]).getElement<HTMLDivElement>();
      const clothLine: HTMLDivElement = new Component('div', [
        catalogStyle.filter_cloth_line,
      ]).getElement<HTMLDivElement>();
      clothLine.textContent = dress;
      const clothLineSymbol: HTMLDivElement = new Component('div', [
        catalogStyle.filter_cloth_line_symbol,
      ]).getElement<HTMLDivElement>();
      clothLineSymbol.textContent = '>';
      clothLine.dataset.clothName = dress.toLowerCase();
      clothLineContainer.append(clothLine, clothLineSymbol);
      clothContainer.append(clothLineContainer);
    });
    const priceContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_price_container,
    ]).getElement<HTMLDivElement>();
    const priceNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_price_name_container,
    ]).getElement<HTMLDivElement>();
    const priceName = new Component('span', [catalogStyle.filter_price_name]).getElement<HTMLSpanElement>();
    priceName.textContent = 'Price';
    const showPrice = new Component('img', [catalogStyle.filter_price_show]).getElement<HTMLImageElement>();
    priceNameContainer.append(priceName, showPrice);
    showPrice.src = unshow;
    priceContainer.append(priceNameContainer);
    const colorsContainer: HTMLDivElement = this.createFilterColors();
    const sizeContainer: HTMLDivElement = this.createFilterSizes();
    const dressContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_dress_container,
    ]).getElement<HTMLDivElement>();
    const dressNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_dress_name_container,
    ]).getElement<HTMLDivElement>();
    const nameDress: HTMLSpanElement = new Component('span', [
      catalogStyle.filter_dress_name,
    ]).getElement<HTMLSpanElement>();
    nameDress.textContent = 'Dress Style';
    const showDress = new Component('img', [catalogStyle.filter_dress_show]).getElement<HTMLImageElement>();
    showDress.src = unshow;
    const dressSelectedContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_select_dress,
    ]).getElement<HTMLDivElement>();
    DressStyles.forEach((styleName) => {
      const styleLineContainer: HTMLAnchorElement = new Component('a', [
        catalogStyle.filter_style_line_container,
      ]).getElement<HTMLAnchorElement>();
      const styleLine: HTMLDivElement = new Component('div', [
        catalogStyle.filter_style_line,
      ]).getElement<HTMLDivElement>();
      styleLine.textContent = styleName;
      const styleLineSymbol: HTMLDivElement = new Component('div', [
        catalogStyle.filter_style_line_symbol,
      ]).getElement<HTMLDivElement>();
      styleLineSymbol.textContent = '>';
      styleLine.dataset.styleName = styleName;
      styleLineContainer.append(styleLine, styleLineSymbol);
      dressSelectedContainer.append(styleLineContainer);
    });
    showDress.addEventListener('click', () => this.clickShowHandler(showDress, dressSelectedContainer));
    dressNameContainer.append(nameDress, showDress);
    dressContainer.append(dressNameContainer, dressSelectedContainer);
    const applyButton: HTMLButtonElement = new Component('button', [
      catalogStyle.filter_button_apply,
    ]).getElement<HTMLButtonElement>();
    applyButton.textContent = 'Apply Filter';
    const resetButton: HTMLButtonElement = new Component('button', [
      catalogStyle.filter_button_reset,
    ]).getElement<HTMLButtonElement>();
    resetButton.textContent = 'Reset Filter';
    this.containerFilters.append(
      nameContainer,
      clothContainer,
      priceContainer,
      colorsContainer,
      sizeContainer,
      dressContainer,
      applyButton,
      resetButton
    );
  }

  createFilterColors() {
    const colorsContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_colors_container,
    ]).getElement<HTMLDivElement>();
    const colorsNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_colors_name_container,
    ]).getElement<HTMLDivElement>();
    const nameColors: HTMLSpanElement = new Component('span', [
      catalogStyle.filter_color_name,
    ]).getElement<HTMLSpanElement>();
    nameColors.textContent = 'Color';
    const showColor = new Component('img', [catalogStyle.filter_color_show]).getElement<HTMLImageElement>();
    showColor.src = unshow;
    const colorSelectContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_select_colors,
    ]).getElement<HTMLDivElement>();
    DressColors.forEach((color) => {
      const colorBox: HTMLDivElement = new Component('div', [
        catalogStyle.filter_color_box,
      ]).getElement<HTMLDivElement>();
      const checkBox: HTMLDivElement = new Component('div', [
        catalogStyle.filter_color_checkbox,
      ]).getElement<HTMLDivElement>();
      colorBox.dataset.color = color;
      colorBox.style.backgroundColor = color;
      colorBox.append(checkBox);
      colorSelectContainer.append(colorBox);
    });
    showColor.addEventListener('click', () => this.clickShowHandler(showColor, colorSelectContainer));
    colorsNameContainer.append(nameColors, showColor);
    colorsContainer.append(colorsNameContainer, colorSelectContainer);
    return colorsContainer;
  }

  createFilterSizes() {
    const sizeContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_size_container,
    ]).getElement<HTMLDivElement>();
    const sizeNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_size_name_container,
    ]).getElement<HTMLDivElement>();
    const nameSize: HTMLSpanElement = new Component('span', [
      catalogStyle.filter_size_name,
    ]).getElement<HTMLSpanElement>();
    nameSize.textContent = 'Size';
    const showSize = new Component('img', [catalogStyle.filter_size_show]).getElement<HTMLImageElement>();
    showSize.src = unshow;
    const sizeSelectContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_select_sizes,
    ]).getElement<HTMLDivElement>();
    DreassSizes.forEach((size) => {
      const sizeBox: HTMLButtonElement = new Component('button', [
        catalogStyle.filter_size_box,
      ]).getElement<HTMLButtonElement>();
      sizeBox.textContent = size.at(0)?.toUpperCase() + size.slice(1);
      sizeBox.dataset.size = size;
      sizeSelectContainer.append(sizeBox);
    });
    showSize.addEventListener('click', () => this.clickShowHandler(showSize, sizeSelectContainer));
    sizeNameContainer.append(nameSize, showSize);
    sizeContainer.append(sizeNameContainer, sizeSelectContainer);
    return sizeContainer;
  }

  clickShowHandler(showElem: HTMLImageElement, container: HTMLDivElement) {
    if (showElem.classList.contains('show-elem')) {
      showElem.src = unshow;
      showElem.classList.remove('show-elem');
      container.classList.remove(catalogStyle.active_elem);
    } else {
      showElem.src = show;
      showElem.classList.add('show-elem');
      container.classList.add(catalogStyle.active_elem);
    }
  }
}
