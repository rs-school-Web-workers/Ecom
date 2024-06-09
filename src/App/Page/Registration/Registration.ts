import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';
import { showLogoutButton, showUserProfileLink } from '../../components/header/Header';
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
  postalCodeRussiaValidator,
  postalCodePolandValidator,
} from '../../utils/validations';
import Page from '../Page';
import './registration.scss';
import { errorInvalidJSON } from './types';

export default class RegistrationPage extends Page {
  private emailInput = createInputView('email', emailValidator, 'Email address', 'Enter your e-mail');
  private passwordInput = createInputView('password', passwordValidator, 'Password', 'Enter your password');
  private nameInput = createInputView('text', nameValidator, 'Name', 'Enter your name');
  private surnameInput = createInputView('text', surnameValidator, 'Surname', 'Enter your surname');
  private dateOfBirthday = createInputView('date', dateOfBirthdayValidator, 'Date of birth');
  private sStreet = createInputView('text', streetValidator, '', 'Shipping Street');
  private sStreetNumber = createInputView('text', [], '', 'Shipping StreetNumber');
  private sCity = createInputView('text', cityValidator, '', 'Shipping City');
  private sPostalCode?: HTMLElement;
  private bStreet = createInputView('text', streetValidator, '', 'Billing Street');
  private bStreetNumber = createInputView('text', [], '', 'Billing StreetNumber');
  private bCity = createInputView('text', cityValidator, '', 'Billing City');
  private bPostalCode?: HTMLElement;
  private sSelectCountry = createSelectView(countries);
  private bSelectCountry = createSelectView(countries);
  private sCheckbox = new Component('input', ['registration__input-check']).getElement<HTMLInputElement>();
  private bCheckbox = new Component('input', ['registration__input-check']).getElement<HTMLInputElement>();
  private сheckboxForBothAddresses = new Component('input', [
    'registration__input-check',
  ]).getElement<HTMLInputElement>();
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
    this.сheckboxForBothAddresses.type = 'checkbox';
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
    this.сheckboxForBothAddresses.addEventListener('change', this.useBothAddress.bind(this));
    this.createForm();
    this.render();
  }

  render() {
    const templateShippingCheckbox = new Component('label', ['registration__label']);
    templateShippingCheckbox.setTextContent('Default Shipping');
    templateShippingCheckbox.setChildren(this.sCheckbox);
    const templateBillingCheckbox = new Component('label', ['registration__label']);
    templateBillingCheckbox.setTextContent('Default Billing');
    templateBillingCheckbox.setChildren(this.bCheckbox);
    this.shippingList.append(
      this.sStreet,
      this.sStreetNumber,
      this.sCity,
      templateShippingCheckbox.getElement<HTMLLabelElement>(),
      this.sSelectCountry
    );
    this.billingList.append(
      this.bStreet,
      this.bStreetNumber,
      this.bCity,
      templateBillingCheckbox.getElement<HTMLLabelElement>(),
      this.bSelectCountry
    );
    this.container?.addEventListener('selectValue', (e) => this.showPostalCode(e), {
      capture: true,
      passive: true,
    });
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
    const templateForBothAddresses = new Component('label', ['registration__label']);
    templateForBothAddresses.setTextContent('Use the same address for both shipping and billing');
    templateForBothAddresses.setChildren(this.сheckboxForBothAddresses);
    form.append(
      title,
      aboutText,
      this.nameInput,
      this.surnameInput,
      this.emailInput,
      this.passwordInput,
      this.dateOfBirthday,
      templateForBothAddresses.getElement<HTMLLabelElement>(),
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
    let sCountry = this.sSelectCountry.shadowRoot?.querySelector('.placeholder')?.textContent;
    const bStreet = this.bStreet.shadowRoot?.children[1].lastChild;
    const bStreetNumber = this.bStreetNumber.shadowRoot?.children[1].lastChild;
    const bCity = this.bCity.shadowRoot?.children[1].lastChild;
    let bCountry = this.sSelectCountry.shadowRoot?.querySelector('.placeholder')?.textContent;
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
      bStreet instanceof HTMLInputElement &&
      bStreetNumber instanceof HTMLInputElement &&
      bCity instanceof HTMLInputElement
    ) {
      if (
        emailInputValue.classList.contains('success') &&
        passwordInputValue.classList.contains('success') &&
        nameInputValue.classList.contains('success') &&
        dateOfBirthdayValue.classList.contains('success') &&
        surnameInputValue.classList.contains('success')
      ) {
        if (this.сheckboxForBothAddresses.checked) {
          if (
            sStreet.classList.contains('success') &&
            sStreetNumber.classList.contains('success') &&
            sCity.classList.contains('success')
          ) {
            const sSelectCountryValue = this.sSelectCountry.shadowRoot?.querySelector('.select__value');

            if (sSelectCountryValue?.classList.contains('success')) {
              const sPostalCode = this.sPostalCode?.shadowRoot?.children[1].lastChild as HTMLInputElement;
              if (!sPostalCode.classList.contains('success')) {
                sPostalCode.classList.add('unsuccess');
              }
            } else {
              sSelectCountryValue?.classList.add('unsuccess');
            }
          } else {
            [sStreet, sStreetNumber, sCity].forEach((listElement) => {
              if (!listElement.classList.contains('success')) {
                listElement.classList.add('unsuccess');
              }
            });
          }
        }
        if (
          sStreet.classList.contains('success') &&
          sStreetNumber.classList.contains('success') &&
          sCity.classList.contains('success') &&
          (this.сheckboxForBothAddresses.checked ||
            (bStreet.classList.contains('success') &&
              bStreetNumber.classList.contains('success') &&
              bCity.classList.contains('success')))
        ) {
          const sSelectCountryValue = this.sSelectCountry.shadowRoot?.querySelector('.select__value');
          const bSelectCountryValue = this.bSelectCountry.shadowRoot?.querySelector('.select__value');
          if (
            sSelectCountryValue?.classList.contains('success') &&
            (this.сheckboxForBothAddresses.checked || bSelectCountryValue?.classList.contains('success'))
          ) {
            const sPostalCode = this.sPostalCode?.shadowRoot?.children[1].lastChild as HTMLInputElement;
            const bPostalCode = this.bPostalCode?.shadowRoot?.children[1].lastChild as HTMLInputElement;
            if (
              sPostalCode.classList.contains('success') &&
              (this.сheckboxForBothAddresses.checked || bPostalCode.classList.contains('success'))
            ) {
              const defaultBilling = this.bCheckbox.checked ? 1 : undefined;
              const defaultShipping = this.sCheckbox.checked ? 0 : undefined;
              const address = [
                {
                  streetName: sStreet.value,
                  streetNumber: sStreetNumber.value,
                  city: sCity.value,
                  country: sCountry,
                  postalCode: sPostalCode.value,
                },
              ];
              if (!this.сheckboxForBothAddresses.checked) {
                address.push({
                  streetName: bStreet.value,
                  streetNumber: bStreetNumber.value,
                  city: bCity.value,
                  country: bCountry,
                  postalCode: bPostalCode.value,
                });
              }
              await signinClient(
                emailInputValue.value,
                nameInputValue.value,
                surnameInputValue.value,
                dateOfBirthdayValue.value,
                passwordInputValue.value,
                address,
                this.сheckboxForBothAddresses.checked ? [0] : [1],
                [0],
                this.сheckboxForBothAddresses.checked ? defaultShipping : defaultBilling,
                defaultShipping
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
              const sPostalCode = this.sPostalCode?.shadowRoot?.children[1].lastChild as HTMLInputElement;
              const bPostalCode = this.bPostalCode?.shadowRoot?.children[1].lastChild as HTMLInputElement;
              [sPostalCode, bPostalCode].forEach((postalCode) => {
                if (postalCode) {
                  if (!postalCode.classList.contains('success')) {
                    postalCode.classList.add('unsuccess');
                  }
                }
              });
            }
          } else {
            const sSelectCountryValue = this.sSelectCountry.shadowRoot?.querySelector('.select__value');
            const bSelectCountryValue = this.bSelectCountry.shadowRoot?.querySelector('.select__value');
            [sSelectCountryValue, bSelectCountryValue].forEach((selectValue) => {
              if (selectValue) {
                if (!selectValue.classList.contains('success')) {
                  selectValue.classList.add('unsuccess');
                }
              }
            });
          }
        } else {
          [sStreet, sStreetNumber, sCity, bStreet, bStreetNumber, bCity].forEach((listElement) => {
            if (!listElement.classList.contains('success')) {
              listElement.classList.add('unsuccess');
            }
          });
        }
      } else {
        [nameInputValue, surnameInputValue, emailInputValue, passwordInputValue, dateOfBirthdayValue].forEach(
          (formElements) => {
            if (!formElements.classList.contains('success')) {
              formElements.classList.add('unsuccess');
            }
          }
        );
      }
    }
    /** ЕСЛИ НАДО ПРОВЕРКА ЧТО
     * emailInputValue instanceof HTMLInputElement &&
      passwordInputValue instanceof HTMLInputElement &&
      nameInputValue instanceof HTMLInputElement &&
      dateOfBirthdayValue instanceof HTMLInputElement &&
      surnameInputValue instanceof HTMLInputElement &&
      sStreet instanceof HTMLInputElement &&
      sStreetNumber instanceof HTMLInputElement &&
      sCity instanceof HTMLInputElement &&
      bStreet instanceof HTMLInputElement &&
      bStreetNumber instanceof HTMLInputElement &&
      bCity instanceof HTMLInputElement

      то добавь else {
        ''
      }
      выше этой записи
    */
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
    showUserProfileLink();
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

  showPostalCode(e: Event) {
    const path = e.composedPath();
    const selectElement = path.find((node) => {
      if (node instanceof HTMLElement) {
        if (node.className === 'placeholder selected') {
          return node;
        }
      }
    }) as HTMLElement;
    path.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node === this.shippingList) {
          if (this.sPostalCode) this.sPostalCode.remove();
          switch (selectElement.getAttribute('shortName')) {
            case 'BY':
              this.sPostalCode = createInputView('text', postalCodeBelarusValidator, '', 'Shipping PostalCode');
              this.shippingList.append(this.sPostalCode);
              break;
            case 'RU':
              this.sPostalCode = createInputView('text', postalCodeRussiaValidator, '', 'Shipping PostalCode');
              this.shippingList.append(this.sPostalCode);
              break;
            case 'PL':
              this.sPostalCode = createInputView('text', postalCodePolandValidator, '', 'Shipping PostalCode');
              this.shippingList.append(this.sPostalCode);
              break;
          }
        } else if (node === this.billingList) {
          if (this.bPostalCode) this.bPostalCode.remove();
          switch (selectElement.getAttribute('shortName')) {
            case 'BY':
              this.bPostalCode = createInputView('text', postalCodeBelarusValidator, '', 'Billing PostalCode');
              this.billingList.append(this.bPostalCode);
              break;
            case 'RU':
              this.bPostalCode = createInputView('text', postalCodeRussiaValidator, '', 'Billing PostalCode');
              this.billingList.append(this.bPostalCode);
              break;
            case 'PL':
              this.bPostalCode = createInputView('text', postalCodePolandValidator, '', 'Billing PostalCode');
              this.billingList.append(this.bPostalCode);
              break;
          }
        }
      }
    });
  }
  useBothAddress(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    const buttonBillingList = this.btnBillingList.getElement<HTMLButtonElement>();
    if (checked) {
      buttonBillingList.style.display = 'none';
      this.billingList.style.display = 'none';
    } else {
      buttonBillingList.style.display = 'block';
      this.billingList.style.display = 'none';
      buttonBillingList.style.opacity = '';
      buttonBillingList.textContent = 'Billing List Show';
      this.bSelectCountry.shadowRoot?.querySelector('.select__value')?.classList.remove('active');
      this.bSelectCountry.shadowRoot?.querySelector('.select__list')?.classList.add('hide');
      this.bSelectCountry.shadowRoot?.querySelector('.chevron')?.classList.remove('active');
    }
  }
}
