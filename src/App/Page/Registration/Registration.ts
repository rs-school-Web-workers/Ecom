import { createInputView } from '../../components/input/inputComponent';
import { signinClient } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import { email, password } from '../../utils/validations';
import Page from '../Page';
import './registration.scss';

export default class RegistrationPage extends Page {
  private emailInput = createInputView('email', email, 'Email address', 'Enter your e-mail') as HTMLInputElement;
  private passwordInput = createInputView('password', password, 'Password', 'Enter your password') as HTMLInputElement;
  private nameInput = createInputView('text', password, 'Name', 'Enter your name') as HTMLInputElement;
  private surnameInput = createInputView('text', password, 'surname', 'Enter your surname') as HTMLInputElement;
  private sStreet = createInputView('text', [], '', 'Shipping Street') as HTMLInputElement;
  private sStreetNumber = createInputView('text', [], '', 'Shipping StreetNumber') as HTMLInputElement;
  private sApartment = createInputView('text', [], '', 'Shipping Apartment') as HTMLInputElement;
  private sCountry = createInputView('text', [], '', 'Shipping Country') as HTMLInputElement;
  private sPostalCode = createInputView('text', [], '', 'Shipping PostalCode') as HTMLInputElement;
  private bStreet = createInputView('text', [], '', 'Billing Street') as HTMLInputElement;
  private bStreetNumber = createInputView('text', [], '', 'Billing StreetNumber') as HTMLInputElement;
  private bApartment = createInputView('text', [], '', 'Billing Apartment') as HTMLInputElement;
  private bCountry = createInputView('text', [], '', 'Billing Country') as HTMLInputElement;
  private bPostalCode = createInputView('text', [], '', 'Billing PostalCode') as HTMLInputElement;
  private sCheckbox = new Component('input', []).getElement() as HTMLInputElement;
  private bCheckbox = new Component('input', []).getElement() as HTMLInputElement;
  private btnSubmit = new Component('button', ['registration__form-btn']);
  private wrapperForm = document.createElement('div');
  private containerImg = document.createElement('div');

  constructor() {
    super(['registration']);
    this.sCheckbox.type = 'checkbox';
    this.bCheckbox.type = 'checkbox';
    this.btnSubmit.setTextContent('Sign Up');
    this.wrapperForm.className = 'registration-form-container';
    this.containerImg.className = 'registration-img-wrapper';
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
      this.surnameInput,
      this.emailInput,
      this.passwordInput,
      this.sStreet,
      this.sStreetNumber,
      this.sApartment,
      this.sCountry,
      this.sPostalCode,
      this.sCheckbox,
      this.bStreet,
      this.bStreetNumber,
      this.bApartment,
      this.bCountry,
      this.bPostalCode,
      this.bCheckbox,
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
    const surnameInputValue = this.surnameInput.shadowRoot?.children[1].lastChild;
    const sStreet = this.sStreet.shadowRoot?.children[1].lastChild;
    const sStreetNumber = this.sStreetNumber.shadowRoot?.children[1].lastChild;
    const sApartment = this.sApartment.shadowRoot?.children[1].lastChild;
    const sCountry = this.sCountry.shadowRoot?.children[1].lastChild;
    const sPostalCode = this.sPostalCode.shadowRoot?.children[1].lastChild;
    const bStreet = this.bStreet.shadowRoot?.children[1].lastChild;
    const bStreetNumber = this.bStreetNumber.shadowRoot?.children[1].lastChild;
    const bApartment = this.bApartment.shadowRoot?.children[1].lastChild;
    const bCountry = this.bCountry.shadowRoot?.children[1].lastChild;
    const bPostalCode = this.bPostalCode.shadowRoot?.children[1].lastChild;
    if (
      emailInputValue instanceof HTMLInputElement &&
      passwordInputValue instanceof HTMLInputElement &&
      nameInputValue instanceof HTMLInputElement &&
      surnameInputValue instanceof HTMLInputElement &&
      sStreet instanceof HTMLInputElement &&
      sStreetNumber instanceof HTMLInputElement &&
      sApartment instanceof HTMLInputElement &&
      sCountry instanceof HTMLInputElement &&
      sPostalCode instanceof HTMLInputElement &&
      bStreet instanceof HTMLInputElement &&
      bStreetNumber instanceof HTMLInputElement &&
      bApartment instanceof HTMLInputElement &&
      bCountry instanceof HTMLInputElement &&
      bPostalCode instanceof HTMLInputElement
    ) {
      if (emailInputValue.classList.contains('success') && passwordInputValue.classList.contains('success')) {
        signinClient(
          emailInputValue.value,
          nameInputValue.value,
          surnameInputValue.value,
          passwordInputValue.value,
          [
            {
              streetName: sStreet.value,
              streetNumber: sStreetNumber.value,
              apartment: sApartment.value,
              country: sCountry.value,
              postalCode: sPostalCode.value,
            },
            {
              streetName: bStreet.value,
              streetNumber: bStreetNumber.value,
              apartment: bApartment.value,
              country: bCountry.value,
              postalCode: bPostalCode.value,
            },
          ],
          [1],
          [0],
          this.bCheckbox.checked ? 1 : undefined,
          this.sCheckbox.checked ? 0 : undefined
        );
      } else {
        console.log('complete all fields');
      }
    }
  }
}
