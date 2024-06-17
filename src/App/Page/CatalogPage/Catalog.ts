import Component from '../../utils/base-component';
import Page from '../Page';
import * as catalogStyle from './catalog.module.scss';
import { CardItem, sortValue, ICatalogFilter, defaultStateFilter, IFilterVariant, defaultVariantFilter } from './types';
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
import { getCart, getCategorieById, getClient, getProductById } from '../../utils/api/Client';
import { Cart, ClientResponse, RangeFacetResult, TermFacetResult } from '@commercetools/platform-sdk';
import { centsToDollar } from '../../utils/helpers';
import { Router } from '../../Router/Router';
import cartLogo from '../../../assets/imgs/car_logo_30.png';

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
  stateFilter: ICatalogFilter = Object.create(defaultStateFilter); // хранит состояние активных фильтров
  variantFilter: IFilterVariant = defaultVariantFilter;
  router;
  categories: { slug: string; id: string; name: string; parent: string | undefined }[] | undefined;
  styles: string[] = [];
  styleSubcategory: string[][] = [];
  category: string;

  constructor(router: Router, category: string = '') {
    super([catalog]);
    this.router = router;
    this.category = category;
    this.initCategory();
    this.initCatalogPage();
  }

  initCategory() {
    if (this.category !== '') {
      this.stateFilter.cloth = [`${this.category}_${this.category}`];
    }
  }

  async initCatalogPage() {
    this.categories = (await getClient()?.categories().get().execute())?.body.results.map((el) => {
      return { id: el.id, name: el.name['en-US'], slug: el.slug['en-US'], parent: el.parent?.id };
    });
    if (this.category !== '') {
      const name = this.categories?.filter((category) => category.slug === this.category)[0].name;
      this.stateFilter.cloth = [`${name}_${name}`];
    }
    const top = this.categories!.filter((el) => !el.parent);
    this.styles = top.map((el) => el.name);
    top.forEach((style) => {
      this.styleSubcategory.push(this.categories!.filter((el) => el.parent === style.id).map((el) => el.name));
    });
    const facets = await getClient()
      ?.productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [
            'variants.attributes.size',
            'variants.attributes.color',
            'variants.attributes.brand',
            'variants.price.centAmount:range(0 to 1000000)',
          ],
        },
      })
      .execute();
    this.variantFilter = {
      colors: (facets?.body.facets['variants.attributes.color'] as TermFacetResult).terms.map((el) => el.term),
      brand: (facets?.body.facets['variants.attributes.brand'] as TermFacetResult).terms.map((el) => el.term),
      sizes: (facets?.body.facets['variants.attributes.size'] as TermFacetResult).terms.map((el) => el.term),
      min: (facets?.body.facets['variants.price.centAmount'] as RangeFacetResult).ranges[0].min,
      max: (facets?.body.facets['variants.price.centAmount'] as RangeFacetResult).ranges[0].max,
    };
    this.createHeaderCatalog();
    this.createFilterContainer();
    this.createSearchContainer();
    this.containerProducts.append(this.listProductsContainer);
    this.modalBackground.addEventListener('click', (event) => this.clickCloseFilterLogoHandler(event));
    this.contentContainer.append(this.containerFilters, this.containerProducts);
    this.container?.append(this.searchContainer, this.contentContainer, this.modalBackground);
    this.render();
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
    this.stateFilter.text = (this.searchContainer.children[1] as HTMLInputElement).value;
    this.render();
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
    this.stateFilter.sort = currentElem.textContent ?? 'asc';
    this.render();
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

  setTitleContainerProducts(text: string = '') {
    this.titleContainerProducts.textContent = text;
  }

  async createCardList() {
    const cart = await getCart();
    if (!cart) {
      throw new Error('Cannot access cart');
    }
    const args: { limit?: number; fuzzy?: boolean; filter?: string[]; sort?: string; 'text.en-US'?: string } = {};
    args.limit = 500;
    args.fuzzy = true;
    args.filter = [];
    if (this.stateFilter.cloth.length && !this.stateFilter.cloth.includes('All')) {
      args.filter.push(
        `categories.id:${this.stateFilter.cloth
          .map((el) => `"${this.categories!.filter((cat) => cat.name === el.split('_')[1])[0].id}"`)
          .join(',')}`
      );
    }
    if (this.stateFilter.min >= 0) {
      args.filter.push(`variants.price.centAmount:range (${this.stateFilter.min} to ${this.stateFilter.max})`);
    }
    if (this.stateFilter.brand.length) {
      args.filter.push(`variants.attributes.brand:${this.stateFilter.brand.map((el) => `"${el}"`).join(',')}`);
    }
    if (this.stateFilter.colors.length) {
      args.filter.push(`variants.attributes.color:${this.stateFilter.colors.map((el) => `"${el}"`).join(',')}`);
    }
    if (this.stateFilter.sizes.length) {
      args.filter.push(`variants.attributes.size:${this.stateFilter.sizes.map((el) => `"${el}"`).join(',')}`);
    }
    if (this.stateFilter.sort === 'asc' || this.stateFilter.sort === 'desc') {
      args.sort = `price ${this.stateFilter.sort}`;
    } else {
      args.sort = 'name.en-US asc';
    }
    args['text.en-US'] = this.stateFilter.text ?? '';
    const products = await getClient()?.productProjections().search().get({ queryArgs: args }).execute();
    const data = await Promise.all<{ [row: string]: string }>(
      products!.body.results.map(async (el) => {
        const priceWithDiscount =
          el.masterVariant.prices![0].discounted?.value.centAmount.toString() ??
          el.masterVariant.prices![0].value.centAmount.toString();
        const priceWithoutDiscount = el.masterVariant.prices![0].value.centAmount.toString();
        return {
          id: el.id,
          category: (await getCategorieById(el.categories[0].id)).body.slug['en-US'],
          name: el.name['en-US'],
          description: el.description!['en-US'],
          priceWithDiscount,
          priceWithoutDiscount: priceWithDiscount === priceWithoutDiscount ? '' : priceWithoutDiscount,
          imageLink: el.masterVariant.images![0].url,
          brand: el.masterVariant.attributes!.filter((el) => el.name === 'brand')[0].value,
        };
      })
    );
    data.forEach(({ id, category, brand, name, description, priceWithDiscount, priceWithoutDiscount, imageLink }) => {
      const dataObject: CardItem = {
        id,
        category,
        name: `${brand} | ${name}`,
        description,
        priceWithDiscount,
        priceWithoutDiscount,
        imageLink,
      };
      const card = this.createCard(dataObject, cart);
      this.listProductsContainer.append(card.getElement());
    });
  }

  createCard(data: CardItem, cart: ClientResponse<Cart>) {
    const card = new Component('div', [catalog__card]);
    const imageCardContainer = new Component('div', [catalogStyle.catalog__cardImgContainer]);
    const imageCard = new Component('img', [catalog__cardImg]);
    imageCardContainer.setChildren(imageCard.getElement());
    imageCard.getElement<HTMLImageElement>().src = `${data.imageLink}`;
    imageCard.getElement<HTMLImageElement>().alt = data.name;
    const titleCard = new Component('h3', [catalog__cardName]);
    titleCard.setTextContent(data.name);
    const descriptionCard = new Component('p', [catalog__cardDescription]);
    descriptionCard.setTextContent(data.description);
    const priceWithDiscount = new Component('span', [catalog__cardPrice]);
    priceWithDiscount.setTextContent(`${centsToDollar(Number(data.priceWithDiscount))}$`);
    const priceWithoutDiscount = new Component('span', [catalog__cardPrice, catalog__cardPrice_dashedGrey]);
    if (data.priceWithoutDiscount !== '') {
      priceWithoutDiscount.setTextContent(`${centsToDollar(Number(data.priceWithoutDiscount))}$`);
    }
    const containerForCardPrices = new Component('div', [catalog__cardPriceContainer]);
    containerForCardPrices.setChildren(priceWithDiscount.getElement(), priceWithoutDiscount.getElement());
    const wrapperAboutCard = new Component('div', [catalog__wrapperAbout]);
    wrapperAboutCard.setChildren(
      titleCard.getElement(),
      descriptionCard.getElement(),
      containerForCardPrices.getElement()
    );
    card.setChildren(
      imageCardContainer.getElement<HTMLImageElement>(),
      wrapperAboutCard.getElement(),
      this.createAddToCartButton(data.id, cart).getElement<HTMLDivElement>()
    );
    card.getElement<HTMLElement>().addEventListener('click', () => {
      const path = `/products/${data.category}/${data.id}`;
      this.router.navigate(path);
      this.router.renderPageView(path);
    });
    return card;
  }

  createAddToCartButton(id: string, cart: ClientResponse<Cart>) {
    const container: Component = new Component('div', [catalogStyle.add_to_cart_container]);
    const button: Component = new Component('button', [catalogStyle.add_to_cart_button]);
    const buttonText: Component = new Component('span', [catalogStyle.add_to_cart_text]);
    const buttonLogo: Component = new Component('img', ['add_to_cart_logo']);
    buttonText.setTextContent('Add to cart');
    // проверяет наличие в корзине
    const cartState = cart?.body.lineItems.filter((el) => el.productId === id).length ?? 1 > 0;
    if (cartState) {
      button.getElement<HTMLButtonElement>().disabled = true;
    }
    buttonLogo.getElement<HTMLImageElement>().src = cartLogo;
    button.setChildren(buttonText.getElement(), buttonLogo.getElement());
    button.getElement<HTMLButtonElement>().dataset.id = id;
    button.getElement<HTMLButtonElement>().addEventListener('click', (event: Event) => {
      event.stopPropagation();
      this.clickAddToCartButtonHandler(event.currentTarget);
    });
    container.setChildren(button.getElement());
    return container;
  }

  async clickAddToCartButtonHandler(target: EventTarget | null) {
    // добавление элемента в корзину
    const cart = await getCart();
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const variantId = (await getProductById(target.dataset.id!)).body.masterData.current.masterVariant.id;
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
              productId: target.dataset.id,
              variantId: variantId,
              quantity: 1,
            },
          ],
        },
      })
      .execute();
    const button: HTMLButtonElement = <HTMLButtonElement>target;
    button.disabled = true;
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
    const clothContainer: HTMLDivElement = this.createFilterCloth();
    const priceContainer: HTMLDivElement = this.createFilterPrice();
    const colorsContainer: HTMLDivElement = this.createFilterColors();
    const sizeContainer: HTMLDivElement = this.createFilterSizes();
    const dressContainer: HTMLDivElement = this.createFilterDress();
    const applyButton: HTMLButtonElement = new Component('button', [
      catalogStyle.filter_button_apply,
    ]).getElement<HTMLButtonElement>();
    applyButton.textContent = 'Apply Filter';
    applyButton.addEventListener('click', () => this.clickApplyHandler());
    const resetButton: HTMLButtonElement = new Component('button', [
      catalogStyle.filter_button_reset,
    ]).getElement<HTMLButtonElement>();
    resetButton.textContent = 'Reset Filter';
    resetButton.addEventListener('click', () => this.clickResetHandler());
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

  clickApplyHandler() {
    const selectedSizeFilter: NodeListOf<HTMLDivElement> = this.containerFilters.querySelectorAll(
      `.${catalogStyle.active_sizebox}`
    );
    const sizeSelect: string[] = [];
    selectedSizeFilter.forEach((size) => {
      if (size.dataset.size !== undefined) {
        sizeSelect.push(size.dataset.size);
      }
    });
    this.stateFilter.sizes = sizeSelect;
    const selectedColorFilter: NodeListOf<HTMLDivElement> = this.containerFilters.querySelectorAll(
      `.${catalogStyle.active_colorBox}`
    );
    const colorSelect: string[] = [];
    selectedColorFilter.forEach((color) => {
      if (color.dataset.color !== undefined) {
        colorSelect.push(color.dataset.color);
      }
    });
    this.stateFilter.colors = colorSelect;
    const minPriceRange: HTMLInputElement | null = this.containerFilters.querySelector(
      `.${catalogStyle.min_range_select}`
    );
    const maxPriceRange: HTMLInputElement | null = this.containerFilters.querySelector(
      `.${catalogStyle.max_range_select}`
    );
    this.stateFilter.min = Number(minPriceRange?.value);
    this.stateFilter.max = Number(maxPriceRange?.value);
    const clothSelect: string[] = [];
    const selectedClothFilter: NodeListOf<HTMLDivElement> = this.containerFilters.querySelectorAll(
      `.${catalogStyle.active_cloth}.${catalogStyle.filter_cloth_line}`
    );
    selectedClothFilter.forEach((cloth) => {
      if (cloth.dataset.clothName !== undefined) {
        clothSelect.push(cloth.dataset.clothName);
      }
    });
    this.stateFilter.cloth = clothSelect;
    const brandSelect: string[] = [];
    const selectedBrandFilter: NodeListOf<HTMLDivElement> = this.containerFilters.querySelectorAll(
      `.${catalogStyle.active_brand}.${catalogStyle.filter_brand_line}`
    );
    selectedBrandFilter.forEach((brand) => {
      if (brand.dataset.brandName !== undefined) {
        brandSelect.push(brand.dataset.brandName);
      }
    });
    this.stateFilter.brand = brandSelect;
    this.render();
  }

  clickResetHandler() {
    const selectedSizeFilter = this.containerFilters.querySelectorAll(`.${catalogStyle.active_sizebox}`);
    selectedSizeFilter.forEach((size) => {
      size.classList.remove(catalogStyle.active_sizebox);
    });
    const selectedColorFilter = this.containerFilters.querySelectorAll(`.${catalogStyle.active_colorBox}`);
    selectedColorFilter.forEach((size) => {
      size.classList.remove(catalogStyle.active_colorBox);
    });
    const minPriceElem: HTMLDivElement | null = this.containerFilters.querySelector(`.${catalogStyle.price_min_value}`);
    const maxPriceElem: HTMLDivElement | null = this.containerFilters.querySelector(`.${catalogStyle.price_max_value}`);
    if (minPriceElem !== null && maxPriceElem !== null) {
      minPriceElem.textContent = `${centsToDollar(this.variantFilter.min)}$`;
      maxPriceElem.textContent = `${centsToDollar(this.variantFilter.max)}$`;
    }
    const minPriceRange: HTMLInputElement | null = this.containerFilters.querySelector(
      `.${catalogStyle.min_range_select}`
    );
    const maxPriceRange: HTMLInputElement | null = this.containerFilters.querySelector(
      `.${catalogStyle.max_range_select}`
    );
    const priceProgress: HTMLDivElement | null = this.containerFilters.querySelector(`.${catalogStyle.price_progress}`);
    if (minPriceRange !== null && maxPriceRange !== null && priceProgress !== null) {
      minPriceRange.value = `${this.variantFilter.min}`;
      maxPriceRange.value = `${this.variantFilter.max}`;
      this.changeProgressHandler(minPriceRange, maxPriceRange, priceProgress);
    }
    const selectedClothFilter = this.containerFilters.querySelectorAll(`.${catalogStyle.active_cloth}`);
    selectedClothFilter.forEach((cloth) => {
      cloth.classList.remove(catalogStyle.active_cloth);
    });
    const selectedBrandFilter = this.containerFilters.querySelectorAll(`.${catalogStyle.active_brand}`);
    selectedBrandFilter.forEach((brand) => {
      brand.classList.remove(catalogStyle.active_brand);
    });
    this.stateFilter = Object.create(defaultStateFilter);
  }

  createFilterPrice() {
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
    showPrice.addEventListener('click', () => this.clickShowHandler(showPrice, priceSelectContainer));
    const priceSelectContainer: HTMLDivElement = new Component('div', [
      catalogStyle.price_select_container,
    ]).getElement<HTMLDivElement>();
    const priceRangeContainer: HTMLDivElement = new Component('div', [
      catalogStyle.price_range_container,
    ]).getElement<HTMLDivElement>();
    const priceValues: HTMLDivElement = new Component('div', [catalogStyle.price_values]).getElement<HTMLDivElement>();
    const priceMinValue: HTMLSpanElement = new Component('div', [
      catalogStyle.price_min_value,
    ]).getElement<HTMLDivElement>();
    const priceMaxValue: HTMLSpanElement = new Component('div', [
      catalogStyle.price_max_value,
    ]).getElement<HTMLDivElement>();
    priceValues.append(priceMinValue, priceMaxValue);
    const priceProgress: HTMLDivElement = new Component('div', [
      catalogStyle.price_progress,
    ]).getElement<HTMLDivElement>();
    const minSelect: HTMLInputElement = new Component('input', [
      catalogStyle.min_range_select,
    ]).getElement<HTMLInputElement>();
    minSelect.type = 'range';
    minSelect.min = `${this.variantFilter.min}`;
    minSelect.max = `${this.variantFilter.max}`;
    minSelect.step = '5';
    minSelect.value = `${this.variantFilter.min}`;
    priceMinValue.textContent = `${centsToDollar(this.variantFilter.min)}$`;
    const maxSelect: HTMLInputElement = new Component('input', [
      catalogStyle.max_range_select,
    ]).getElement<HTMLInputElement>();
    maxSelect.type = 'range';
    maxSelect.min = `${this.variantFilter.min}`;
    maxSelect.max = `${this.variantFilter.max}`;
    maxSelect.step = '5';
    maxSelect.value = `${this.variantFilter.max}`;
    priceMaxValue.textContent = `${centsToDollar(this.variantFilter.max)}$`;
    priceProgress.style.background = `linear-gradient(to right, #dadae5 ${minSelect.value}% , #000000 ${minSelect.value}% , #000000 ${maxSelect.value}%, #dadae5 ${maxSelect.value}%)`;
    minSelect.addEventListener('input', () =>
      this.inputMinInputHandler(minSelect, maxSelect, priceProgress, priceMinValue, priceMaxValue)
    );
    maxSelect.addEventListener('input', () =>
      this.inputMaxInputHandler(minSelect, maxSelect, priceProgress, priceMinValue, priceMaxValue)
    );
    priceRangeContainer.append(priceProgress, minSelect, maxSelect);
    priceSelectContainer.append(priceRangeContainer, priceValues);
    priceContainer.append(priceNameContainer, priceSelectContainer);
    return priceContainer;
  }

  changeProgressHandler(minInput: HTMLInputElement, maxInput: HTMLInputElement, progress: HTMLDivElement) {
    const lengthRange: number = Number(minInput.max);
    const min: number = (Number(minInput.value) / lengthRange) * 100;
    const max: number = (Number(maxInput.value) / lengthRange) * 100;
    progress.style.background = `linear-gradient(to right, #dadae5 ${min}% , #000000 ${min}% , #000000 ${max}%, #dadae5 ${max}%)`;
  }

  inputMinInputHandler(
    minInput: HTMLInputElement,
    maxInput: HTMLInputElement,
    progress: HTMLDivElement,
    min: HTMLSpanElement,
    max: HTMLSpanElement
  ) {
    if (Number(maxInput.value) < Number(minInput.value)) {
      maxInput.value = minInput.value;
    }
    this.changeProgressHandler(minInput, maxInput, progress);
    min.textContent = centsToDollar(Number(minInput.value)) + `$`;
    max.textContent = centsToDollar(Number(maxInput.value)) + `$`;
  }

  inputMaxInputHandler(
    minInput: HTMLInputElement,
    maxInput: HTMLInputElement,
    progress: HTMLDivElement,
    min: HTMLSpanElement,
    max: HTMLSpanElement
  ) {
    if (Number(maxInput.value) < Number(minInput.value)) {
      minInput.value = maxInput.value;
    }
    this.changeProgressHandler(minInput, maxInput, progress);
    min.textContent = centsToDollar(Number(minInput.value)) + `$`;
    max.textContent = centsToDollar(Number(maxInput.value)) + `$`;
  }

  createFilterCloth() {
    const clothContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_cloth_container,
    ]).getElement<HTMLDivElement>();
    const clothNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_cloth_name_container,
    ]).getElement<HTMLDivElement>();
    const nameDress: HTMLSpanElement = new Component('span', [
      catalogStyle.filter_cloth_name,
    ]).getElement<HTMLSpanElement>();
    nameDress.textContent = 'Dress Style';
    const showDress = new Component('img', [catalogStyle.filter_cloth_show]).getElement<HTMLImageElement>();
    showDress.src = unshow;
    clothNameContainer.append(nameDress, showDress);
    const clothSelectedContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_style_dress,
    ]).getElement<HTMLDivElement>();
    showDress.addEventListener('click', () => this.clickShowHandler(showDress, clothSelectedContainer));
    this.styles.forEach((style, index) => {
      const clothStyleLineContainer: HTMLDivElement = new Component('div', [
        catalogStyle.filter_style_cloth_line_container,
      ]).getElement<HTMLDivElement>();
      const clothStyleNameLineContainer: HTMLDivElement = new Component('div', [
        catalogStyle.filter_cloth_line_name_container,
      ]).getElement<HTMLDivElement>();
      const clothStyleLine: HTMLDivElement = new Component('div', [
        catalogStyle.filter_style_name,
      ]).getElement<HTMLDivElement>();
      clothStyleLine.textContent = style;
      const clothStyleLineSymbol: HTMLImageElement = new Component('img', [
        catalogStyle.filter_style_show,
      ]).getElement<HTMLImageElement>();
      clothStyleLineSymbol.src = unshow;
      clothStyleNameLineContainer.append(clothStyleLine, clothStyleLineSymbol);
      const selectStyleClothContainer: HTMLDivElement = new Component('div', [
        catalogStyle.filter_style_cloth_dress,
      ]).getElement<HTMLDivElement>();
      clothStyleLineSymbol.addEventListener('click', () =>
        this.clickShowHandler(clothStyleLineSymbol, selectStyleClothContainer)
      );
      this.styleSubcategory[index].forEach((dress) => {
        const clothLineContainer: HTMLDivElement = new Component('div', [
          catalogStyle.filter_cloth_line_container,
        ]).getElement<HTMLDivElement>();
        const clothLine: HTMLDivElement = new Component('div', [
          catalogStyle.filter_cloth_line,
        ]).getElement<HTMLDivElement>();
        clothLine.textContent = dress;
        clothLine.dataset.clothName = `${style}_${dress}`;
        const clothLineSymbol: HTMLDivElement = new Component('div', [
          catalogStyle.filter_cloth_line_symbol,
        ]).getElement<HTMLDivElement>();
        clothLineSymbol.textContent = '>';
        clothLineContainer.append(clothLine, clothLineSymbol);
        selectStyleClothContainer.append(clothLineContainer);
      });
      selectStyleClothContainer.addEventListener('click', (event) => {
        this.clickFilterClothHandler(event, catalogStyle.active_cloth);
      });
      clothStyleLineContainer.append(clothStyleNameLineContainer, selectStyleClothContainer);
      clothSelectedContainer.append(clothStyleLineContainer);
    });
    const clothStyleLineContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_style_cloth_line_container,
    ]).getElement<HTMLDivElement>();
    const clothStyleNameLineContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_cloth_line_name_container,
    ]).getElement<HTMLDivElement>();
    const clothStyleLine: HTMLDivElement = new Component('div', [
      catalogStyle.filter_style_name,
      catalogStyle.filter_cloth_line,
    ]).getElement<HTMLDivElement>();
    clothStyleLine.textContent = 'All';
    clothStyleLine.dataset.clothName = `All`;
    clothStyleNameLineContainer.append(clothStyleLine);
    clothStyleNameLineContainer.addEventListener('click', (event) =>
      this.clickFilterClothHandler(event, catalogStyle.active_cloth)
    );
    clothStyleLineContainer.append(clothStyleNameLineContainer);
    clothSelectedContainer.append(clothStyleLineContainer);
    clothContainer.append(clothNameContainer, clothSelectedContainer);
    return clothContainer;
  }

  clickFilterClothHandler(event: Event, className: string) {
    const elem: HTMLButtonElement = <HTMLButtonElement>event.target;
    elem.classList.toggle(className);
    const currentCategory = elem.dataset.clothName?.split('_')[0];
    const selectedClothFilter: NodeListOf<HTMLDivElement> = this.containerFilters.querySelectorAll(
      `.${catalogStyle.active_cloth}.${catalogStyle.filter_cloth_line}`
    );
    selectedClothFilter.forEach((cloth) => {
      if (cloth.dataset.clothName !== undefined) {
        const clothCategory = cloth.dataset.clothName?.split('_')[0];
        if (currentCategory !== clothCategory) {
          cloth.classList.remove(catalogStyle.active_cloth);
        }
      }
    });
  }

  createFilterDress() {
    const dressContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_dress_container,
    ]).getElement<HTMLDivElement>();
    const dressNameContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_dress_name_container,
    ]).getElement<HTMLDivElement>();
    const nameDress: HTMLSpanElement = new Component('span', [
      catalogStyle.filter_dress_name,
    ]).getElement<HTMLSpanElement>();
    nameDress.textContent = 'Dress Brand';
    const showDress = new Component('img', [catalogStyle.filter_dress_show]).getElement<HTMLImageElement>();
    showDress.src = unshow;
    const dressSelectedContainer: HTMLDivElement = new Component('div', [
      catalogStyle.filter_select_dress,
    ]).getElement<HTMLDivElement>();
    this.variantFilter.brand.forEach((brandName) => {
      const styleLineContainer: HTMLDivElement = new Component('div', [
        catalogStyle.filter_brand_line_container,
      ]).getElement<HTMLDivElement>();
      const styleLine: HTMLDivElement = new Component('div', [
        catalogStyle.filter_brand_line,
      ]).getElement<HTMLDivElement>();
      styleLine.textContent = brandName;
      const styleLineSymbol: HTMLDivElement = new Component('div', [
        catalogStyle.filter_brand_line_symbol,
      ]).getElement<HTMLDivElement>();
      styleLineSymbol.textContent = '>';
      styleLine.dataset.brandName = brandName;
      styleLineContainer.append(styleLine, styleLineSymbol);
      styleLineContainer.addEventListener('click', (event) =>
        this.clickFilterElemHandler(event, catalogStyle.active_brand)
      );
      dressSelectedContainer.append(styleLineContainer);
    });
    showDress.addEventListener('click', () => this.clickShowHandler(showDress, dressSelectedContainer));
    dressNameContainer.append(nameDress, showDress);
    dressContainer.append(dressNameContainer, dressSelectedContainer);
    return dressContainer;
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
    this.variantFilter.colors.forEach((color) => {
      const colorBox: HTMLDivElement = new Component('div', [
        catalogStyle.filter_color_box,
      ]).getElement<HTMLDivElement>();
      const checkBox: HTMLDivElement = new Component('div', [
        catalogStyle.filter_color_checkbox,
      ]).getElement<HTMLDivElement>();
      colorBox.dataset.color = color;
      colorBox.style.backgroundColor = color;
      colorBox.addEventListener('click', (event) => this.clickFilterColorHandler(event, catalogStyle.active_colorBox));
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
    this.variantFilter.sizes.forEach((size) => {
      const sizeBox: HTMLButtonElement = new Component('button', [
        catalogStyle.filter_size_box,
      ]).getElement<HTMLButtonElement>();
      sizeBox.textContent = size.at(0)?.toUpperCase() + size.slice(1);
      sizeBox.dataset.size = size;
      sizeBox.addEventListener('click', (event) => this.clickFilterElemHandler(event, catalogStyle.active_sizebox));
      sizeSelectContainer.append(sizeBox);
    });
    showSize.addEventListener('click', () => this.clickShowHandler(showSize, sizeSelectContainer));
    sizeNameContainer.append(nameSize, showSize);
    sizeContainer.append(sizeNameContainer, sizeSelectContainer);
    return sizeContainer;
  }

  clickFilterElemHandler(event: Event, className: string) {
    const elem: HTMLButtonElement = <HTMLButtonElement>event.target;
    elem.classList.toggle(className);
  }

  clickFilterColorHandler(event: Event, className: string) {
    const elem: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
    elem.classList.toggle(className);
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
