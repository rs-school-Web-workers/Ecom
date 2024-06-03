import { InputNewType } from './types';
import { styles } from './inputTextComponentStyles';

interface Validation {
  validate: (value: string) => boolean;
  message: string;
}

export class InputNewControl extends HTMLElement {
  private errMsg = document.createElement('div');
  private input = document.createElement('input');
  private label = document.createElement('label');
  private labelText = document.createElement('span');
  private wrapper = document.createElement('div');
  private wrapperSvg = document.createElement('div');
  private btnEdit = document.createElement('button');
  private btnDelete = document.createElement('button');
  private btnCheck = document.createElement('button');
  private SVGPATHS = {
    SVGEDIT:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>',
    SVGCHECK:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>',
    SVGTRASH:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',
  };

  validationArray: Validation[];

  constructor(
    type: InputNewType = 'text',
    validationArray: Validation[] = [],
    labelName: string,
    placeholder: string = '',
    setEdit: boolean = false,
    setDelete: boolean = false
  ) {
    super();
    this.input.setAttribute('type', type);
    this.input.disabled = true;
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    this.labelText.textContent = labelName;
    this.input.placeholder = placeholder;
    this.wrapper.append(this.labelText, this.wrapperSvg);
    this.label.append(this.wrapper, this.input);
    this.validationArray = validationArray;
    shadow.append(style, this.label, this.errMsg);
    this.init();
    this.createControlsInput(setEdit, setDelete);
  }

  init() {
    this.errMsg.classList.add('error-message');
    this.label.classList.add('label-input');
    this.input.classList.add('input-field');
    this.labelText.classList.add('label-text');
    this.wrapper.classList.add('wrapper');
    this.wrapperSvg.classList.add('wrapper-buttons');
    this.btnEdit.classList.add('button');
    this.btnDelete.classList.add('button');
    this.btnCheck.classList.add('button');
  }

  createControlsInput(setEdit: boolean, setDelete: boolean) {
    const { SVGTRASH, SVGEDIT, SVGCHECK } = this.SVGPATHS;
    if (setDelete) {
      this.btnDelete.innerHTML = SVGTRASH;
      this.wrapperSvg.append(this.btnDelete);
    }
    if (setEdit) {
      this.btnEdit.innerHTML = SVGEDIT;
      this.btnCheck.innerHTML = SVGCHECK;
      this.wrapperSvg.append(this.btnEdit, this.btnCheck);
      this.btnCheck.disabled = true;
      this.btnEdit.onclick = () => this.editProperty();
      this.btnCheck.onclick = () => this.saveProperty();
    }
  }

  editProperty() {
    this.input.disabled = false;
    this.btnEdit.disabled = true;
    this.btnCheck.disabled = false;
    this.input.focus();
  }
  saveProperty() {
    if (this.input.classList.contains('unsuccess')) {
      this.input.classList.add('shake');
      this.errMsg.classList.add('shake');
      setTimeout(() => {
        this.input.classList.remove('shake');
        this.errMsg.classList.remove('shake');
      }, 500);
    } else {
      this.input.disabled = true;
      this.btnEdit.disabled = false;
      this.btnCheck.disabled = true;
    }
  }

  connectedCallback() {
    this.input.oninput = () => this.validateInput(this.validationArray);
  }

  private validateInput(validationType: Validation[]) {
    for (const { validate, message } of validationType) {
      const value = this.input.value;
      this.errMsg.textContent = '';
      this.errMsg.classList.remove('error');
      if (!validate(value)) {
        this.errMsg.textContent = message;
        this.errMsg.classList.add('error');
        break;
      }
    }
    if (!this.errMsg.classList.contains('error')) {
      this.input.classList.add('success');
      this.input.classList.remove('unsuccess');
    } else {
      this.input.classList.add('unsuccess');
      this.input.classList.remove('success');
    }
  }

  setDisabled() {}

  get value() {
    return this.input.value;
  }
  set value(value: string) {
    this.input.value = value;
  }
}
customElements.define('input-text', InputNewControl);
