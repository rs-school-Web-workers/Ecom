import Component from '../../utils/base-component';
import Page from '../Page';
import './login.scss';
import { createInputView } from '../../components/input/inputComponent';
import { emailValidator, passwordValidator } from '../../utils/validations';
import { loginClient } from '../../utils/api/Client';
import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';
import { showLogoutButton } from '../../components/header/Header';
import type { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';

export default class LoginPage extends Page {
  private emailInput = createInputView('email', emailValidator, 'Email address', 'Enter your e-mail');
  private passwordInput = createInputView('password', passwordValidator, 'Password', 'Enter your password');
  private btnSubmit = new Component('button', ['login__form-btn']);
  private wrapperForm = document.createElement('div');
  private containerImg = document.createElement('div');
  private eye = new Component('input', ['eye']).getElement<HTMLInputElement>();

  constructor(private router: Router) {
    super(['login']);
    this.btnSubmit.setTextContent('Login');
    this.wrapperForm.className = 'login-form-container';
    this.containerImg.className = 'login-img-wrapper';
    this.createForm();
    this.render();
    this.emailInput.addEventListener('focus', () => this.toggler());
    this.passwordInput.addEventListener('focus', () => this.toggler());
  }

  render() {
    this.container?.append(this.wrapperForm, this.containerImg);
  }

  createForm() {
    const title = document.createElement('h1');
    title.classList.add('login__title');
    title.textContent = 'Welcome back!';
    const aboutText = document.createElement('p');
    aboutText.textContent = 'Enter your credentials to access your account';
    aboutText.classList.add('login__about-text');
    const footer = document.createElement('div');
    footer.classList.add('login__footer');
    const footerLinkToPage = document.createElement('a');
    footerLinkToPage.classList.add('login__footer-link');
    footerLinkToPage.textContent = 'Sign Up';
    footerLinkToPage.href = '/registration';
    footerLinkToPage.addEventListener('click', (event) => this.signupHandler(event));
    footer.innerHTML = `Don't have an account? `;
    footer.append(footerLinkToPage);
    const form = document.createElement('form');
    form.classList.add('login__form');
    this.eye.type = 'checkbox';
    this.eye.id = 'eye';
    this.eye.addEventListener('change', () => this.togglePasswordHandler());
    const label = new Component('label', ['eye-label']).getElement<HTMLLabelElement>();
    label.setAttribute('for', 'eye');
    label.textContent = 'toggle password';
    const checkboxWrap = new Component('div', ['eye-wrap']).getElement<HTMLDivElement>();
    checkboxWrap.append(this.eye, label);
    form.append(
      title,
      aboutText,
      this.emailInput,
      this.passwordInput,
      checkboxWrap,
      this.btnSubmit.getElement(),
      footer
    );
    form.addEventListener('submit', this.handlerSubmit.bind(this));
    this.wrapperForm.append(form);
  }

  async handlerSubmit(e: Event) {
    e.preventDefault();
    const emailInputValue = this.emailInput.shadowRoot?.children[1].lastChild;
    const passwordInputValue = this.passwordInput.shadowRoot?.children[1].lastChild;
    if (emailInputValue instanceof HTMLInputElement && passwordInputValue instanceof HTMLInputElement) {
      if (emailInputValue.classList.contains('success') && passwordInputValue.classList.contains('success')) {
        try {
          await loginClient(emailInputValue.value, passwordInputValue.value);
          this.router.navigate(PagePath.MAIN);
          this.router.renderPageView(PagePath.MAIN);
          showLogoutButton();
        } catch (resp) {
          const err = (resp as ClientResponse).body as ErrorResponse;
          if ((err as ErrorResponse).errors?.filter((el) => el.code === 'InvalidCredentials')[0]) {
            emailInputValue.classList.add('unsuccess');
            emailInputValue.classList.add('crederror');
            emailInputValue.classList.remove('success');
            this.emailInput.shadowRoot!.querySelector('.error-message')!.textContent = 'Invalid email or password';
            passwordInputValue.classList.add('unsuccess');
            passwordInputValue.classList.add('crederror');
            passwordInputValue.classList.remove('success');
            this.passwordInput.shadowRoot!.querySelector('.error-message')!.textContent = 'Invalid email or password';
          }
        }
      } else {
        if (!emailInputValue.classList.contains('success')) {
          emailInputValue.classList.add('unsuccess');
          emailInputValue.classList.add('crederror');
          emailInputValue.classList.remove('success');
          this.emailInput.shadowRoot!.querySelector('.error-message')!.textContent = 'Enter login';
        }
        if (!passwordInputValue.classList.contains('success')) {
          passwordInputValue.classList.add('unsuccess');
          passwordInputValue.classList.add('crederror');
          passwordInputValue.classList.remove('success');
          this.passwordInput.shadowRoot!.querySelector('.error-message')!.textContent = 'Enter password';
        }
      }
    }
  }

  toggler() {
    const emailInputValue = this.emailInput.shadowRoot?.children[1].lastChild;
    const passwordInputValue = this.passwordInput.shadowRoot?.children[1].lastChild;
    if (
      emailInputValue instanceof HTMLInputElement &&
      passwordInputValue instanceof HTMLInputElement &&
      emailInputValue.classList.contains('crederror') &&
      passwordInputValue.classList.contains('crederror')
    ) {
      emailInputValue.dispatchEvent(new Event('validate'));
      passwordInputValue.dispatchEvent(new Event('validate'));
      emailInputValue.classList.remove('crederror');
      passwordInputValue.classList.remove('crederror');
    }
  }

  togglePasswordHandler() {
    const input = this.passwordInput.shadowRoot?.querySelector('.input-field') as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  signupHandler(event: Event) {
    event.preventDefault();
    const targetElem: HTMLAnchorElement | null = <HTMLAnchorElement>event.target;
    if (targetElem) {
      const navigateLink: string | null = targetElem.getAttribute('href');
      if (navigateLink) {
        this.router.navigate(navigateLink);
        this.router.renderPageView(navigateLink);
      }
    }
  }
}
