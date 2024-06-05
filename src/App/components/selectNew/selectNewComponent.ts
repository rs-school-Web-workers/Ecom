import Component from '../../utils/base-component';
import { styles } from './selectNewComponentStyles';

interface Country {
  id: string;
  shortCountryName: string;
  fullCountryName: string;
}

export class SelectNewControl extends HTMLElement {
  private component = new Component('div', ['select']);
  private placeholder = new Component('span', ['placeholder']);
  countries: Country[];
  constructor(countries: Country[]) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    this.countries = countries;
    shadow.append(style, this.component.getElement<HTMLDivElement>());
  }
  connectedCallback() {
    const dropdown = this.showDropdown();
    const input = this.createInput();
    this.component.getElement<HTMLDivElement>().append(input, dropdown);
  }
  private createInput() {
    const input = document.createElement('div');
    input.classList.add('select__value');
    input.addEventListener('click', () => this.toggleDropdown());
    const inputPlaceholder = document.createElement('div');
    inputPlaceholder.classList.add('select__value-placeholder');
    const chevron = document.createElement('span');
    chevron.classList.add('chevron');
    inputPlaceholder.append(this.placeholder.getElement<HTMLSpanElement>(), chevron);
    input.appendChild(inputPlaceholder);
    return input;
  }
  private showDropdown() {
    const structure = document.createElement('div');
    structure.classList.add('select__list', 'hide');
    this.countries.forEach((country) => {
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
    return structure;
  }

  private toggleDropdown() {
    const dropdown = this.shadowRoot?.querySelector('.select__list');
    const input = this.shadowRoot?.querySelector('.select__value');
    const chevron = this.shadowRoot?.querySelector('.chevron');
    dropdown?.classList.toggle('hide');
    input?.classList.toggle('active');
    chevron?.classList.toggle('active');
  }
  selectOption(name: string, shortName: string) {
    const text = this.placeholder.getElement<HTMLSpanElement>();
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
      const selectValueEvent = new CustomEvent('selectNewValue', {
        cancelable: true,
        composed: true,
        detail: {
          value: shortName,
        },
      });
      text.dispatchEvent(selectValueEvent);
    }
  }
  setValue(value: string) {
    this.countries.forEach((el) => {
      if (el.shortCountryName === value) {
        this.placeholder.setTextContent(el.fullCountryName);
        this.placeholder.setClasses(['selected']);
      }
    });
  }

  getValue(): string {
    let result;
    this.countries.forEach((el) => {
      if (el.fullCountryName === this.placeholder.getElement<HTMLSpanElement>().textContent) {
        result = el.shortCountryName;
      }
    });
    return result || '';
  }

  getSuccess() {
    return this.placeholder.getElement<HTMLSpanElement>().classList.contains('selected');
  }

  resetState() {
    const selectValue = this.shadowRoot?.querySelector('.select__value');
    selectValue?.classList.remove('success');
  }
}
customElements.define('select-component', SelectNewControl);
