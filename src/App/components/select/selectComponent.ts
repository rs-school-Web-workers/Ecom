import Component from '../../utils/base-component';
import { selectValueEvent } from '../../utils/custom-event';
import { styles } from './selectComponentStyles';

interface Country {
  id: string;
  shortCountryName: string;
  fullCountryName: string;
}

class SelectControl extends HTMLElement {
  private component = new Component('div', ['select']);
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    shadow.append(style, this.component.getElement<HTMLDivElement>());
  }
  connectedCallback() {
    const input = this.createInput();
    const dropdown = this.showDropdown();
    this.component.getElement<HTMLDivElement>().append(input, dropdown);
  }
  static get observedAttributes() {
    return ['country'];
  }
  createInput() {
    const input = document.createElement('div');
    input.classList.add('select__value');
    input.addEventListener('click', () => this.toggleDropdown());
    const inputPlaceholder = document.createElement('div');
    inputPlaceholder.classList.add('select__value-placeholder');
    const placeholder = document.createElement('span');
    placeholder.textContent = 'Select Country';
    placeholder.classList.add('placeholder');
    const chevron = document.createElement('span');
    chevron.classList.add('chevron');
    inputPlaceholder.append(placeholder, chevron);
    input.appendChild(inputPlaceholder);
    return input;
  }
  showDropdown() {
    const structure = document.createElement('div');
    structure.classList.add('select__list', 'hide');
    const attrCountry = this.getAttribute('country');
    this.removeAttribute('country');
    if (attrCountry) {
      const parsedAttr: Country[] = JSON.parse(attrCountry);
      parsedAttr.forEach((country) => {
        const { id, shortCountryName, fullCountryName } = country;
        const option = document.createElement('div');
        option.classList.add('select__list-item');
        option.addEventListener('click', () => this.selectOption(fullCountryName, shortCountryName));
        option.setAttribute('id', id);
        const fullName = document.createElement('span');
        fullName.classList.add('select__list-item_fullname');
        fullName.textContent = fullCountryName;
        const shortName = document.createElement('span');
        shortName.classList.add('select__list-item_shortname');
        shortName.textContent = `(${shortCountryName})`;
        option.append(fullName, shortName);
        structure.append(option);
      });
    }
    return structure;
  }
  toggleDropdown() {
    const dropdown = this.shadowRoot?.querySelector('.select__list');
    const input = this.shadowRoot?.querySelector('.select__value');
    const chevron = this.shadowRoot?.querySelector('.chevron');
    dropdown?.classList.toggle('hide');
    input?.classList.toggle('active');
    chevron?.classList.toggle('active');
  }
  selectOption(name: string, shortName: string) {
    const text = this.shadowRoot?.querySelector('.placeholder');
    const selectValue = this.shadowRoot?.querySelector('.select__value');
    text?.setAttribute('shortName', shortName);
    if (text) {
      text.classList.add('selected');
      text.textContent = name;
      this.toggleDropdown();
      if (selectValue?.classList.contains('unsuccess')) {
        selectValue.classList.remove('unsuccess');
      }
      selectValue?.classList.add('success');
      text.dispatchEvent(selectValueEvent);
    }
  }
}

customElements.define('select-element', SelectControl);

export function createSelectView(countryArray: Country[]) {
  const select = document.createElement('select-element');
  select.setAttribute('country', JSON.stringify(countryArray));
  return select;
}
