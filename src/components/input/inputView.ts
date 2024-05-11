import { InputTypes } from '../../types/types';
import './inputView.scss';

interface Validation {
  validate: (value: string) => boolean;
  message: string;
}

class InputView extends HTMLInputElement {
  private validationsEmail: Validation[] = [
    {
      validate: (value: string) => /^\S+@\S+\.\S+$/.test(value.trim()),
      message: 'Invalid email address format',
    },
    {
      validate: (value: string) => !value.includes(' '),
      message: 'Email address cannot contain spaces',
    },
    {
      validate: (value: string) => value.indexOf('@') !== -1,
      message: "Email address must contain '@' symbol",
    },
    {
      validate: (value: string) => value.split('@').length === 2 && value.split('@')[1].includes('.'),
      message: 'Email address must contain a valid domain',
    },
  ];
  private validationsPassword: Validation[] = [
    {
      validate: (value) => value.length >= 8,
      message: 'Password must be at least 8 characters long',
    },
    {
      validate: (value) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter (A-Z)',
    },
    {
      validate: (value) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter (a-z)',
    },
    {
      validate: (value) => /\d/.test(value),
      message: 'Password must contain at least one digit (0-9)',
    },
    {
      validate: (value) => /[!@#$%^&*]/.test(value),
      message: 'Password must contain at least one special character (!@#$%^&*)',
    },
    {
      validate: (value) => value.trim() === value,
      message: 'Password must not contain leading or trailing whitespace',
    },
  ];
  private errorMessages: Map<Validation, HTMLDivElement> = new Map();

  constructor() {
    super();
  }
  connectedCallback() {
    switch (this.type) {
      case 'email': {
        this.initErrorMessages(this.validationsEmail);
        this.addEventListener('input', this.validateInput.bind(this, this.validationsEmail));
        break;
      }
      case 'password': {
        this.initErrorMessages(this.validationsPassword);
        this.addEventListener('input', this.validateInput.bind(this, this.validationsPassword));
        break;
      }
    }
  }
  disconnectedCallback() {
    /* ... */
  }
  static get observedAttributes() {
    return ['type'];
  }
  attributeChangedCallback() {}
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
      if (!validation.validate(value)) {
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

export function createInputView(type: InputTypes = 'text', classes: string[] = []) {
  customElements.define('input-view', InputView, { extends: 'input' });
  const wrapper = document.createElement('div');
  const input = document.createElement('input', { is: 'input-view' });
  input.type = type;
  input.classList.add('input-field', ...classes);
  wrapper.append(input);
  return wrapper;
}
