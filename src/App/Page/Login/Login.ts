import Component from '../../utils/base-component';
import Page from '../Page';
import './login.scss';
import { createInputView } from '../../components/input/inputComponent';
import { email, password } from '../../utils/validations';

export default class LoginPage extends Page {
  private emailInput = createInputView('email', email, 'Email address', 'Enter your e-mail');
  private passwordInput = createInputView('password', password, 'Password', 'Enter your password');
  private btnSubmit = new Component('button', ['login__form-btn']);
  private wrapperForm = document.createElement('div');
  private containerImg = document.createElement('div');

  constructor() {
    super(['login']);
    this.btnSubmit.setTextContent('Login');
    this.wrapperForm.className = 'login-form-container';
    this.containerImg.className = 'login-img-wrapper';
    // btn
    //   .getElement<HTMLElement>()
    //   .addEventListener('click', () =>
    //     getApiRoot(
    //       (emailInput.children[0] as HTMLInputElement).value,
    //       (passwordInput.children[0] as HTMLInputElement).value
    //     )
    //   );
    this.createForm();
    this.render();
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
    footer.innerHTML = `Don't have an account? ${footerLinkToPage.outerHTML}`;
    const form = document.createElement('form');
    form.classList.add('login__form');
    form.append(title, aboutText, this.emailInput, this.passwordInput, this.btnSubmit.getElement(), footer);
    form.addEventListener('submit', this.handlerSubmit.bind(this));
    this.wrapperForm.append(form);
  }

  handlerSubmit(e: Event) {
    e.preventDefault();
    const emailInputValue = this.emailInput.shadowRoot?.children[1].lastChild;
    const passwordInputValue = this.passwordInput.shadowRoot?.children[1].lastChild;
    if (emailInputValue instanceof HTMLInputElement && passwordInputValue instanceof HTMLInputElement) {
      if (emailInputValue.classList.contains('success') && passwordInputValue.classList.contains('success')) {
        console.log('form submit');
      } else {
        console.log('complete all fields');
      }
    }
  }
}
