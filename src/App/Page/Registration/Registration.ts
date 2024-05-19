import { createInputView } from '../../components/input/inputComponent';
import Component from '../../utils/base-component';
import { email, password } from '../../utils/validations';
import Page from '../Page';
import './registration.scss';

export default class RegistrationPage extends Page {
  private emailInput = createInputView('email', email, 'Email address', 'Enter your e-mail');
  private passwordInput = createInputView('password', password, 'Password', 'Enter your password');
  private nameInput = createInputView('text', password, 'Name', 'Enter your name');
  private btnSubmit = new Component('button', ['registration__form-btn']);
  private wrapperForm = document.createElement('div');
  private containerImg = document.createElement('div');

  constructor() {
    super(['registration']);
    this.btnSubmit.setTextContent('Sign Up');
    this.wrapperForm.className = 'registration-form-container';
    this.containerImg.className = 'registration-img-wrapper';
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
    title.classList.add('registration__title');
    title.textContent = 'Get Started Now';
    const aboutText = document.createElement('p');
    aboutText.textContent = 'Enter your credentials to register your account';
    aboutText.classList.add('registration__about-text');
    const footer = document.createElement('div');
    footer.classList.add('registration__footer');
    const footerLinkToPage = document.createElement('a');
    footerLinkToPage.classList.add('registration__footer-link');
    footerLinkToPage.textContent = 'Sign In';
    footerLinkToPage.href = '/login';
    footer.innerHTML = `Have an account? ${footerLinkToPage.outerHTML}`;
    const form = document.createElement('form');
    form.classList.add('registration__form');
    form.append(
      title,
      aboutText,
      this.nameInput,
      this.emailInput,
      this.passwordInput,
      this.btnSubmit.getElement(),
      footer
    );
    form.addEventListener('submit', this.handlerSubmit.bind(this));
    this.wrapperForm.append(form);
  }

  handlerSubmit(e: Event) {
    e.preventDefault();
    const emailInputValue = this.emailInput.shadowRoot?.children[1].lastChild;
    const passwordInputValue = this.passwordInput.shadowRoot?.children[1].lastChild;
    const nameInputValue = this.nameInput.shadowRoot?.children[1].lastChild;
    if (
      emailInputValue instanceof HTMLInputElement &&
      passwordInputValue instanceof HTMLInputElement &&
      nameInputValue instanceof HTMLInputElement
    ) {
      if (
        emailInputValue.classList.contains('success') &&
        passwordInputValue.classList.contains('success') &&
        nameInputValue.classList.contains('sucess')
      ) {
        console.log('form submit');
      } else {
        console.log('complete all fields');
      }
    }
  }
}
