import { InputType } from '../../types/types';
import './inputComponent.scss';

interface Validation {
  validate: (value: string) => boolean;
  message: string;
}

class InputControl extends HTMLInputElement {
  private errMsg: HTMLDivElement;

  constructor() {
    super();
    this.errMsg = document.createElement('div');
    this.errMsg.classList.add('error-message');
  }
  connectedCallback() {
    const validations = this.getAttribute('validations');
    if (validations) {
      const validationArray: Validation[] = JSON.parse(validations);
      this.parentNode?.append(this.errMsg);
      this.addEventListener('input', this.validateInput.bind(this, validationArray));
    }
  }
  disconnectedCallback() {
    /* ... */
  }
  static get observedAttributes() {
    return ['type', 'validations'];
  }
  attributeChangedCallback(/*name: string, oldValue: string, newValue: string*/) {
    /* ... */
  }
  adoptedCallback() {
    /* ... */
  }

  validateInput(validationType: Validation[]) {
    validationType.some((validation) => {
      const value = this.value;
      const functionValidate = new Function('value', `return ${validation.validate}`);
      this.errMsg.textContent = '';
      this.errMsg.classList.remove('error');
      if (!functionValidate()(value)) {
        this.errMsg.textContent = validation.message;
        this.errMsg.classList.add('error');
        return true;
      }
    });
    if (!this.errMsg.classList.contains('error')) {
      this.classList.add('success');
      this.classList.remove('unsuccess');
    } else {
      this.classList.add('unsuccess');
      this.classList.remove('success');
    }
  }
}

customElements.define('input-control', InputControl, { extends: 'input' });

export function createInputView(
  type: InputType = 'text',
  classes: string[] = [],
  validationArray: { validate: string; message: string }[] = []
) {
  const wrapper = document.createElement('div');
  const input = document.createElement('input', { is: 'input-control' });
  input.type = type;
  input.classList.add('input-field', ...classes);
  if (validationArray) {
    input.setAttribute('validations', JSON.stringify(validationArray));
  }
  wrapper.append(input);
  return wrapper;
}
class InputCntrl extends HTMLElement {
  shadow: ShadowRoot;
  input: HTMLInputElement;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.input = document.createElement('input', { is: 'input-control' });
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        width: 250px;
          .input-field {
            outline: none;
            margin-bottom: 4px;
            border: 2px solid;
            padding: 8px;
            border-radius: 8px;
            font-size: 16px;
            &.success {
              border-color: #6fcf97;
            }
            &.unsuccess {
              border-color: #ee5757;
            }
          }
          .error-message {
            color: red;
            font-size: 8px;
            padding-left: 3px;
          }
          .error {
            margin-bottom: 4px;
          }
      }
    `;
    this.input.classList.add('input-field');
    this.shadow.append(style, this.input);
  }

  connectedCallback() {
    const attrValidations = this.getAttribute('validations');
    const attrType = this.getAttribute('type');
    if (attrValidations && attrType) {
      this.input.setAttribute('validations', attrValidations);
      this.input.type = attrType;
    }
    this.removeAttribute('validations');
    this.removeAttribute('type');
  }

  disconnectedCallback() {
    /* ... */
  }

  static get observedAttributes() {
    return ['validations', 'type'];
  }
  attributeChangedCallback(/*name: string, oldValue: string, newValue: string*/) {
    /* ... */
  }
  adoptedCallback() {
    /* ... */
  }
}

customElements.define('input-element', InputCntrl);

export function createInputCntrl(
  type: InputType = 'text',
  validationArray: { validate: string; message: string }[] = []
) {
  const input = document.createElement('input-element');
  if (validationArray && type) {
    input.setAttribute('type', type);
    input.setAttribute('validations', JSON.stringify(validationArray));
  }
  return input;
}
