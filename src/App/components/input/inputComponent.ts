import { InputType } from '../../../types/types';
import './inputComponent.scss';

interface Validation {
  validate: (value: string) => boolean;
  message: string;
}

class InputControl extends HTMLInputElement {
  private errorMessages: Map<Validation, HTMLDivElement> = new Map();

  constructor() {
    super();
  }
  connectedCallback() {
    const validations = this.getAttribute('validations');
    if (validations) {
      const validationArray: Validation[] = JSON.parse(validations);
      this.initErrorMessages(validationArray);
      this.addEventListener('input', this.validateInput.bind(this, validationArray));
    }
  }
  disconnectedCallback() {
    /* ... */
  }
  static get observedAttributes() {
    return ['type', 'validations'];
  }
  attributeChangedCallback() {
    /* ... */
  }
  adoptedCallback() {
    /* ... */
  }

  initErrorMessages(validationType: Validation[]) {
    validationType.forEach((validation) => {
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      this.parentNode?.insertBefore(errorMessage, this.nextSibling);
      this.errorMessages.set(validation, errorMessage);
    });
  }

  validateInput(validationType: Validation[]) {
    validationType.forEach((validation) => {
      const value = this.value;
      const functionValidate = new Function('value', `return ${validation.validate}`);
      if (!functionValidate()(value)) {
        this.errorMessages.get(validation)!.textContent = validation.message;
        this.errorMessages.get(validation)!.classList.add('error');
      } else {
        this.errorMessages.get(validation)!.textContent = '';
        this.errorMessages.get(validation)!.classList.remove('error');
      }
    });
    if (document.querySelectorAll('.error-message.error').length === 0) {
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
