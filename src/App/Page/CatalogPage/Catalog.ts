import Component from '../../utils/base-component';
import mydata from '../../../assets/data/mydata.json';
import Page from '../Page';
import * as catalogStyle from './catalog.module.scss';
import loki from '../../../assets/imgs/loki.webp';
import {
  CardItem,
  sortValue,
  ICatalogFilter,
  defaultStateFilter,
  styles,
  styleSubcategory,
  IFilterVariant,
  defaultVariantFilter,
} from './types';
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
  stateFilter: ICatalogFilter = Object.create(defaultStateFilter); // хранит состояние активных фильтров
  variantFilter: IFilterVariant = defaultVariantFilter;

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

  initFilterVariant() {
    // инициализация значений критериеы фильтра
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
      `.${catalogStyle.active_brand}.${catalogStyle.filter_style_line}`
    );
    selectedBrandFilter.forEach((brand) => {
      if (brand.dataset.brandName !== undefined) {
        brandSelect.push(brand.dataset.brandName);
      }
    });
    this.stateFilter.brand = brandSelect;
    console.log(sizeSelect);
    console.log(colorSelect);
    console.log(brandSelect);
    console.log(clothSelect);
    //запрос с данными на фильтрацию
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
      minPriceElem.textContent = `${this.variantFilter.min}$`;
      maxPriceElem.textContent = `${this.variantFilter.max}$`;
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
    priceMinValue.textContent = `${this.variantFilter.min}$`;
    const maxSelect: HTMLInputElement = new Component('input', [
      catalogStyle.max_range_select,
    ]).getElement<HTMLInputElement>();
    maxSelect.type = 'range';
    maxSelect.min = `${this.variantFilter.min}`;
    maxSelect.max = `${this.variantFilter.max}`;
    maxSelect.step = '5';
    maxSelect.value = `${this.variantFilter.max}`;
    priceMaxValue.textContent = `${this.variantFilter.max}$`;
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
    min.textContent = minInput.value + `$`;
    max.textContent = maxInput.value + `$`;
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
    min.textContent = minInput.value + `$`;
    max.textContent = maxInput.value + `$`;
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
    styles.forEach((style, index) => {
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
      styleSubcategory[index].forEach((dress) => {
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
        console.log(currentCategory);
        console.log(clothCategory);
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
