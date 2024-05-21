import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';
import { showLogoutButton } from '../../components/header/Header';
import { createInputView } from '../../components/input/inputComponent';
import { createSelectView } from '../../components/select/selectComponent';
import { signinClient } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import { countries } from '../../utils/countries';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  surnameValidator,
  cityValidator,
  streetValidator,
  dateOfBirthdayValidator,
  postalCodeBelarusValidator,
} from '../../utils/validations';
import Page from '../Page';
import './registration.scss';
import { errorInvalidJSON } from './types';

export default class RegistrationPage extends Page {
  private emailInput = createInputView('email', emailValidator, 'Email address', 'Enter your e-mail');
  private passwordInput = createInputView('password', passwordValidator, 'Password', 'Enter your password');
  private nameInput = createInputView('text', nameValidator, 'Name', 'Enter your name');
  private surnameInput = createInputView('text', surnameValidator, 'Surname', 'Enter your surname');
  private dateOfBirthday = createInputView(
    'date',
    dateOfBirthdayValidator,
    'Date of birth',
    'Enter your date of birth DD.MM.YYYY'
  );
  private sStreet = createInputView('text', streetValidator, '', 'Shipping Street');
  private sStreetNumber = createInputView('text', [], '', 'Shipping StreetNumber');
  private sCity = createInputView('text', cityValidator, '', 'Shipping City');
  private sPostalCode = createInputView('text', postalCodeBelarusValidator, '', 'Shipping PostalCode');
  private bStreet = createInputView('text', streetValidator, '', 'Billing Street');
  private bStreetNumber = createInputView('text', [], '', 'Billing StreetNumber');
  private bCity = createInputView('text', cityValidator, '', 'Billing City');
  private bPostalCode = createInputView('text', postalCodeBelarusValidator, '', 'Billing PostalCode');
  private sSelectCountry = createSelectView(countries);
  private bSelectCountry = createSelectView(countries);
  private sCheckbox = new Component('input', ['registration__input-check']).getElement<HTMLInputElement>();
  private bCheckbox = new Component('input', ['registration__input-check']).getElement<HTMLInputElement>();
  private btnSubmit = new Component('button', ['registration__form-btn']);
  private wrapperForm = document.createElement('div');
  private containerImg = document.createElement('div');
  private shippingList = document.createElement('div');
  private billingList = document.createElement('div');
  private btnShippingList = new Component('button', [
    'registration__btn-list-show',
    'registration__btn-list-show_shipping',
  ]);
  private btnBillingList = new Component('button', [
    'registration__btn-list-show',
    'registration__btn-list-show_billing',
  ]);

  constructor(private router: Router) {
    super(['registration']);
    this.sCheckbox.type = 'checkbox';
    this.bCheckbox.type = 'checkbox';
    this.btnSubmit.setTextContent('Sign Up');
    this.btnSubmit.getElement<HTMLButtonElement>().type = 'submit';
    this.btnShippingList.setTextContent('Shipping List Show');
    this.shippingList.style.display = 'none';
    this.billingList.style.display = 'none';
    this.btnBillingList.setTextContent('Billing List Show');
    this.btnBillingList.getElement<HTMLButtonElement>().type = 'button';
    this.btnShippingList.getElement<HTMLButtonElement>().type = 'button';
    this.wrapperForm.className = 'registration-form-container';
    this.containerImg.className = 'registration-img-wrapper';
    this.shippingList.className = 'registration__list-shipping';
    this.billingList.className = 'registration__list-billing';
    this.createForm();
    this.render();
  }

  render() {
    const templateShippingCheckbox = `<label class="registration__label">Default Shipping ${this.sCheckbox.outerHTML}</label>`;
    const templateBillingCheckbox = `<label class="registration__label">Default Billing ${this.bCheckbox.outerHTML}</label>`;
    this.shippingList.append(this.sStreet, this.sStreetNumber, this.sCity, this.sSelectCountry, this.sPostalCode);
    this.billingList.append(this.bStreet, this.bStreetNumber, this.bCity, this.bSelectCountry, this.bPostalCode);
    this.sCity.insertAdjacentHTML('afterend', templateShippingCheckbox);
    this.bCity.insertAdjacentHTML('afterend', templateBillingCheckbox);
    this.btnShippingList.getElement<HTMLButtonElement>().onclick = (e) => this.toogleList(e);
    this.btnBillingList.getElement<HTMLButtonElement>().onclick = (e) => this.toogleList(e);
    this.container?.append(this.wrapperForm, this.containerImg);
    const modalBackground: HTMLDivElement = new Component('div', ['modal-background']).getElement<HTMLDivElement>();
    this.container?.append(modalBackground);
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
    footerLinkToPage.addEventListener('click', (event) => this.signinHandler(event));
    footer.innerHTML = `Have an account? `;
    footer.append(footerLinkToPage);
    const form = document.createElement('form');
    form.classList.add('registration__form');
    form.append(
      title,
      aboutText,
      this.nameInput,
      this.surnameInput,
      this.emailInput,
      this.passwordInput,
      this.dateOfBirthday,
      this.btnShippingList.getElement<HTMLButtonElement>(),
      this.shippingList,
      this.btnBillingList.getElement<HTMLButtonElement>(),
      this.billingList,
      this.btnSubmit.getElement<HTMLButtonElement>(),
      footer
    );
    form.addEventListener('submit', this.handlerSubmit.bind(this));
    this.wrapperForm.append(form);
  }

  signinHandler(event: Event) {
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

  async handlerSubmit(e: Event) {
    e.preventDefault();
    const emailInputValue = this.emailInput.shadowRoot?.children[1].lastChild;
    const passwordInputValue = this.passwordInput.shadowRoot?.children[1].lastChild;
    const nameInputValue = this.nameInput.shadowRoot?.children[1].lastChild;
    const surnameInputValue = this.surnameInput.shadowRoot?.children[1].lastChild;
    const dateOfBirthdayValue = this.dateOfBirthday.shadowRoot?.children[1].lastChild;
    const sStreet = this.sStreet.shadowRoot?.children[1].lastChild;
    const sStreetNumber = this.sStreetNumber.shadowRoot?.children[1].lastChild;
    const sCity = this.sCity.shadowRoot?.children[1].lastChild;
    let sCountry = this.sSelectCountry.shadowRoot?.querySelector('.placeholder.selected')?.textContent;
    const sPostalCode = this.sPostalCode.shadowRoot?.children[1].lastChild;
    const bStreet = this.bStreet.shadowRoot?.children[1].lastChild;
    const bStreetNumber = this.bStreetNumber.shadowRoot?.children[1].lastChild;
    const bCity = this.bCity.shadowRoot?.children[1].lastChild;
    let bCountry = this.sSelectCountry.shadowRoot?.querySelector('.placeholder.selected')?.textContent;
    const bPostalCode = this.bPostalCode.shadowRoot?.children[1].lastChild;

    const sCountryShort = countries.filter((country) => country.fullCountryName === sCountry);
    const bCountryShort = countries.filter((country) => country.fullCountryName === bCountry);
    sCountry = sCountryShort.length ? sCountryShort[0].shortCountryName : 'BY';
    bCountry = bCountryShort.length ? bCountryShort[0].shortCountryName : 'BY';
    if (
      emailInputValue instanceof HTMLInputElement &&
      passwordInputValue instanceof HTMLInputElement &&
      nameInputValue instanceof HTMLInputElement &&
      dateOfBirthdayValue instanceof HTMLInputElement &&
      surnameInputValue instanceof HTMLInputElement &&
      sStreet instanceof HTMLInputElement &&
      sStreetNumber instanceof HTMLInputElement &&
      sCity instanceof HTMLInputElement &&
      sPostalCode instanceof HTMLInputElement &&
      bStreet instanceof HTMLInputElement &&
      bStreetNumber instanceof HTMLInputElement &&
      bCity instanceof HTMLInputElement &&
      bPostalCode instanceof HTMLInputElement
    ) {
      if (emailInputValue.classList.contains('success') && passwordInputValue.classList.contains('success')) {
        await signinClient(
          emailInputValue.value,
          nameInputValue.value,
          surnameInputValue.value,
          dateOfBirthdayValue.value,
          passwordInputValue.value,
          [
            {
              streetName: sStreet.value,
              streetNumber: sStreetNumber.value,
              city: sCity.value,
              country: sCountry,
              postalCode: sPostalCode.value,
            },
            {
              streetName: bStreet.value,
              streetNumber: bStreetNumber.value,
              city: bCity.value,
              country: bCountry,
              postalCode: bPostalCode.value,
            },
          ],
          [1],
          [0],
          this.bCheckbox.checked ? 1 : undefined,
          this.sCheckbox.checked ? 0 : undefined
        )
          .then(() => this.successRegister(''))
          .catch((msg) => {
            if (msg.message === errorInvalidJSON.errorMsg) {
              this.successRegister(errorInvalidJSON.showMsg);
            } else {
              this.successRegister(msg.message);
            }
          });
      } else {
        console.log('complete all fields');
      }
    }
  }

  successRegister(msg: string) {
    const registerContainer: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.registration');
    const modalBackground: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.modal-background');
    modalBackground?.classList.add('modal-active');
    const msgContainer: HTMLDivElement = new Component('div', ['register-msg-container']).getElement<HTMLDivElement>();
    const msgText: HTMLDivElement = new Component('div', ['register-msg-text']).getElement<HTMLDivElement>();
    const msgButton: HTMLButtonElement = new Component('button', [
      'register-msg-button',
    ]).getElement<HTMLButtonElement>();
    msgButton.textContent = 'Ok';
    if (msg === '') {
      msgText.textContent = 'Registration completed successfully!';
      msgButton.addEventListener('click', () => this.hideRegisterMsg());
    } else {
      msgText.textContent = msg;
      msgButton.addEventListener('click', () => {
        msgContainer.remove();
        modalBackground?.classList.remove('modal-active');
      });
    }
    msgContainer.append(msgText, msgButton);
    registerContainer?.append(msgContainer);
  }

  hideRegisterMsg() {
    const msgContainer: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.register-msg-container');
    const modalBackground: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.modal-background');
    msgContainer?.remove();
    modalBackground?.classList.remove('modal-active');
    this.router.navigate(PagePath.MAIN);
    this.router.renderPageView(PagePath.MAIN);
    showLogoutButton();
  }

  toogleList(el: Event) {
    const { currentTarget } = el;
    if (currentTarget instanceof HTMLElement) {
      if (currentTarget.classList.contains('registration__btn-list-show_shipping')) {
        if (this.shippingList.style.display === 'none') {
          this.shippingList.style.display = 'grid';
          currentTarget.textContent = 'Shipping List Close';
          currentTarget.style.opacity = '0.5';
        } else {
          this.shippingList.style.display = 'none';
          currentTarget.style.opacity = '';
          currentTarget.textContent = 'Shipping List Show';
        }
      }
      if (currentTarget.classList.contains('registration__btn-list-show_billing')) {
        if (this.billingList.style.display === 'none') {
          this.billingList.style.display = 'grid';
          currentTarget.textContent = 'Billing List Close';
          currentTarget.style.opacity = '0.5';
        } else {
          this.billingList.style.display = 'none';
          currentTarget.style.opacity = '';
          currentTarget.textContent = 'Billing List Show';
        }
      }
    }
  }

  showPostalCode() {}
}
