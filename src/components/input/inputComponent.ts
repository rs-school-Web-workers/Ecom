import { InputType } from '../../types/types';
import { styles } from './inputСomponentStyles';

interface Validation {
  validate: (value: string) => boolean;
  message: string;
}
class InputControl extends HTMLElement {
  private errMsg = document.createElement('div');
  private input = document.createElement('input');

  constructor() {
    super();
    this.errMsg.classList.add('error-message');
    this.input.classList.add('input-field');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    shadow.append(style, this.input, this.errMsg);
  }

  connectedCallback() {
    const attrValidations = this.getAttribute('validations');
    const attrType = this.getAttribute('type');
    if (attrValidations) {
      const validationArray: Validation[] = JSON.parse(attrValidations);
      this.input.addEventListener('input', this.validateInput.bind(this, validationArray));
      if (attrType) {
        this.input.setAttribute('validations', attrValidations);
        this.input.type = attrType;
      }
    }
    this.removeAttribute('validations');
    this.removeAttribute('type');
  }
  static get observedAttributes() {
    return ['validations', 'type'];
  }
  validateInput(validationType: Validation[]) {
    for (const { validate, message } of validationType) {
      const value = this.input.value;
      const getFunctionValidate = new Function('value', `return ${validate}`);
      this.errMsg.textContent = '';
      this.errMsg.classList.remove('error');
      if (!getFunctionValidate()(value)) {
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
}

customElements.define('input-element', InputControl);

export function createInputView(
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
