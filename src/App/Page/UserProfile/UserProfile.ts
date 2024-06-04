import { InputTextControl } from '../../components/inputText/inputTextComponent';
import { getUserProfile, changeUserProfile } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import Page from '../Page';
import {
  cityValidator,
  dateOfBirthdayValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  postalCodeBelarusValidator,
  postalCodePolandValidator,
  postalCodeRussiaValidator,
  streetValidator,
  surnameValidator,
} from '../../utils/validationsInputText';
import * as userProfileStyle from './userprofile.module.scss';
import { createSelectView } from '../../components/select/selectComponent';
import { countries } from '../../utils/countries';
import { addressItem, getUserProfileData } from './types';

const {
  userProfile,
  userProfile__formContainer,
  userProfile__form,
  userProfile__title,
  userProfile__addressesContainer,
  userProfile__formContainer_addresses,
  userProfile__wrapperCheckBox,
  userProfile__wrapperCheckBox_default,
  userProfile__btnDelete,
  userProfile__aboutText,
  // userProfile__btnListShow,
  userProfile__FormList,
  userProfile__label,
  userProfile__inputCheck,
  userProfile__formBtn,
  userProfile__listBtn,
  // userProfile__footer,
  // userProfile__footerLink,
  userProfileImgWrapper,
} = userProfileStyle;

export class UserProfilePage extends Page {
  private emailInput = new InputTextControl('email', emailValidator, 'Email address', 'Enter your e-mail', true);
  private passwordInput = new InputTextControl('password', passwordValidator, 'Password', 'Enter your password', true);
  private nameInput = new InputTextControl('text', nameValidator, 'Name', 'Enter your name', true);
  private surnameInput = new InputTextControl('text', surnameValidator, 'Surname', 'Enter your surname', true);
  private dateOfBirthday = new InputTextControl('date', dateOfBirthdayValidator, 'Date of birth', '', true);
  private wrapperForm = new Component('div', [userProfile__formContainer]);
  private addressesContainer = new Component('div', [userProfile__addressesContainer]);
  private addressesList = new Component('div', [userProfile__formContainer_addresses]);
  private containerImg = new Component('div', [userProfileImgWrapper]);

  constructor() {
    super([userProfile]);
    this.container?.append(
      this.wrapperForm.getElement<HTMLDivElement>(),
      this.addressesContainer.getElement<HTMLDivElement>(),
      this.containerImg.getElement<HTMLDivElement>()
    );
    this.initAddressesContainer();
    this.setData();
  }

  async setData() {
    const { body } = await getUserProfile();
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      addresses,
      defaultBillingAddressId,
      defaultShippingAddressId,
      shippingAddressIds,
      billingAddressIds,
    } = body as getUserProfileData;
    this.createFormPersonalUserInformation(firstName, lastName, dateOfBirth, email);
    addresses.forEach(({ streetName, streetNumber, postalCode, id, country, city }: addressItem) => {
      this.createFormAddressesUserInformation({
        streetNameValue: streetName || '',
        streetNumberValue: streetNumber || '',
        postalCodeValue: postalCode || '',
        countryValue: country || '',
        id,
        cityValue: city || '',
        defaultBillingValue: defaultBillingAddressId === id,
        defaultShippingValue: defaultShippingAddressId === id,
        shippingValue: shippingAddressIds.includes(id),
        billingValue: billingAddressIds.includes(id),
      });
    });
  }

  initAddressesContainer() {
    const title = new Component('h1', [userProfile__title]);
    title.setTextContent('User Addresses');
    const titleList = new Component('h3', [userProfile__aboutText]);
    titleList.setTextContent('Your List of Addresses');
    this.addressesContainer.setChildren(title.getElement(), titleList.getElement(), this.addressesList.getElement());
  }

  createFormPersonalUserInformation(
    nameValue: string,
    surnameValue: string,
    dateOfBirthValue: string,
    emailValue: string
  ) {
    const title = new Component('h1', [userProfile__title]);
    title.setTextContent('User Information');
    const form = new Component('form', [userProfile__form]);
    const buttonSubmit = new Component('button', [userProfile__formBtn]);
    buttonSubmit.setTextContent('Save Changes');
    buttonSubmit.getElement<HTMLButtonElement>().type = 'submit';
    buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    this.nameInput.value = nameValue;
    this.surnameInput.value = surnameValue;
    this.dateOfBirthday.value = dateOfBirthValue;
    this.emailInput.value = emailValue;
    form.setChildren(
      title.getElement(),
      this.nameInput,
      this.surnameInput,
      this.emailInput,
      this.dateOfBirthday,
      buttonSubmit.getElement<HTMLButtonElement>()
    );
    form.getElement<HTMLFormElement>().addEventListener(
      'inputStateChange',
      (e: Event) => {
        const customEvent = e as CustomEvent<{ state: boolean }>;
        if (
          customEvent.detail.state &&
          this.nameInput.getSuccess() &&
          this.surnameInput.getSuccess() &&
          this.emailInput.getSuccess() &&
          this.dateOfBirthday.getSuccess()
        ) {
          buttonSubmit.getElement<HTMLButtonElement>().disabled = false;
        } else {
          buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
        }
      },
      { capture: true, passive: true }
    );
    form
      .getElement<HTMLFormElement>()
      .addEventListener('submit', (e) => this.submitSaveFormPersonalUserInformation(e, buttonSubmit));
    this.wrapperForm.setChildren(form.getElement<HTMLFormElement>());
  }

  async submitSaveFormPersonalUserInformation(event: Event, buttonSubmit: Component) {
    event.preventDefault();
    const arr = [this.nameInput, this.surnameInput, this.emailInput, this.dateOfBirthday];
    if (
      this.nameInput.getSuccess() &&
      this.surnameInput.getSuccess() &&
      this.emailInput.getSuccess() &&
      this.dateOfBirthday.getSuccess()
    ) {
      const { version } = (await getUserProfile()).body;
      const { firstName, lastName, email, dateOfBirth } = {
        firstName: this.nameInput.value,
        lastName: this.surnameInput.value,
        email: this.emailInput.value,
        dateOfBirth: this.dateOfBirthday.value,
      };
      await changeUserProfile(version, firstName, lastName, email, dateOfBirth);
      this.nameInput.resetState();
      this.surnameInput.resetState();
      this.emailInput.resetState();
      this.dateOfBirthday.resetState();
      buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    } else {
      arr.forEach((input) => {
        if (!input.getSuccess()) {
          input.checkState();
        }
      });
      buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    }
  }

  createFormAddressesUserInformation({
    streetNameValue,
    streetNumberValue,
    postalCodeValue,
    countryValue,
    cityValue,
    defaultBillingValue = false,
    defaultShippingValue = false,
    shippingValue = false,
    billingValue = false,
    id,
  }: {
    streetNameValue: string;
    streetNumberValue: string;
    postalCodeValue: string;
    countryValue: string;
    cityValue: string;
    defaultBillingValue?: boolean;
    defaultShippingValue?: boolean;
    shippingValue?: boolean;
    billingValue?: boolean;
    id: string;
  }) {
    const form = new Component('form', [userProfile__FormList]);
    const btnDelete = new Component('button', [userProfile__btnDelete]);
    const SVGTRASH =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
    btnDelete.getElement<HTMLButtonElement>().innerHTML = SVGTRASH;
    btnDelete.getElement<HTMLButtonElement>().type = 'button';
    const wrapperDefaultBillingAndShippingCheckbox = new Component('div', [userProfile__wrapperCheckBox_default]);
    const checkboxDefaultBilling = new Component('input', [
      userProfile__inputCheck,
      'default-billing',
    ]).getElement<HTMLInputElement>();
    checkboxDefaultBilling.type = 'checkbox';
    const templateDefaultCheckboxBilling = new Component('label', [userProfile__label]);
    templateDefaultCheckboxBilling.setTextContent('Default Billing');
    templateDefaultCheckboxBilling.setChildren(checkboxDefaultBilling);
    const checkboxDefaultShipping = new Component('input', [
      userProfile__inputCheck,
      'default-shipping',
    ]).getElement<HTMLInputElement>();
    checkboxDefaultShipping.type = 'checkbox';
    const templateDefaultCheckboxShipping = new Component('label', [userProfile__label]);
    templateDefaultCheckboxShipping.setTextContent('Deafult Shipping');
    templateDefaultCheckboxShipping.setChildren(checkboxDefaultShipping);
    wrapperDefaultBillingAndShippingCheckbox.setChildren(
      templateDefaultCheckboxBilling.getElement(),
      templateDefaultCheckboxShipping.getElement(),
      btnDelete.getElement()
    );
    const street = new InputTextControl('text', streetValidator, 'Street', 'Enter street', true);
    const streetNumber = new InputTextControl('text', [], 'Street Number', 'Enter street number', true);
    const city = new InputTextControl('text', cityValidator, 'City', 'Enter city', true);
    const selectCountry = createSelectView(countries);
    const wrapperBillingAndShippingCheckbox = new Component('div', [userProfile__wrapperCheckBox]);
    const checkboxBilling = new Component('input', [userProfile__inputCheck, 'billing']).getElement<HTMLInputElement>();
    checkboxBilling.type = 'checkbox';
    const templateCheckboxBilling = new Component('label', [userProfile__label]);
    templateCheckboxBilling.setTextContent('Billing');
    templateCheckboxBilling.setChildren(checkboxBilling);
    const checkboxShipping = new Component('input', [
      userProfile__inputCheck,
      'shipping',
    ]).getElement<HTMLInputElement>();
    checkboxShipping.type = 'checkbox';
    const templateCheckboxShipping = new Component('label', [userProfile__label]);
    templateCheckboxShipping.setTextContent('Shipping');
    templateCheckboxShipping.setChildren(checkboxShipping);
    wrapperBillingAndShippingCheckbox.setChildren(
      templateCheckboxBilling.getElement(),
      templateCheckboxShipping.getElement()
    );
    const buttonSubmit = new Component('button', [userProfile__formBtn, userProfile__listBtn]);
    buttonSubmit.setTextContent('Save Changes');
    buttonSubmit.getElement<HTMLButtonElement>().type = 'submit';
    let postalCode;
    form.setId(id);
    street.value = streetNameValue;
    streetNumber.value = streetNumberValue;
    city.value = cityValue;
    let selectValue: HTMLElement;
    setTimeout(() => {
      selectValue = selectCountry.shadowRoot?.querySelector('.placeholder') as HTMLElement;
      selectValue.textContent = countryValue;
    }, 100);
    switch (countryValue) {
      case 'BY':
        postalCode = new InputTextControl('text', postalCodeBelarusValidator, 'Postal Code', 'Enter postal code', true);
        break;
      case 'RU':
        postalCode = new InputTextControl('text', postalCodeRussiaValidator, 'Postal Code', 'Enter postal code', true);
        break;
      case 'PL':
        postalCode = new InputTextControl('text', postalCodePolandValidator, 'Postal Code', 'Enter postal code', true);
        break;
    }
    if (postalCode) {
      postalCode.value = postalCodeValue;
    }
    checkboxDefaultBilling.checked = defaultBillingValue;
    checkboxDefaultShipping.checked = defaultShippingValue;
    checkboxShipping.checked = shippingValue;
    checkboxBilling.checked = billingValue;
    form.setChildren(
      wrapperDefaultBillingAndShippingCheckbox.getElement(),
      street,
      streetNumber,
      city,
      wrapperBillingAndShippingCheckbox.getElement(),
      selectCountry,
      postalCode!,
      buttonSubmit.getElement<HTMLButtonElement>()
    );
    this.addressesList.setChildren(form.getElement<HTMLFormElement>());
  }
  // showPostalCode(e: Event) {
  //   const path = e.composedPath();
  //   const selectElement = path.find((node) => {
  //     if (node instanceof HTMLElement) {
  //       if (node.className === 'placeholder selected') {
  //         return node;
  //       }
  //     }
  //   }) as HTMLElement;
  //   path.forEach((node) => {
  //     if (node instanceof HTMLElement) {
  //       if (node === this.shippingList) {
  //         if (this.sPostalCode) this.sPostalCode.remove();
  //         switch (selectElement.getAttribute('shortName')) {
  //           case 'BY':
  //             this.sPostalCode = createInputView('text', postalCodeBelarusValidator, '', 'PostalCode');
  //             this.shippingList.append(this.sPostalCode);
  //             break;
  //           case 'RU':
  //             this.sPostalCode = createInputView('text', postalCodeRussiaValidator, '', 'PostalCode');
  //             this.shippingList.append(this.sPostalCode);
  //             break;
  //           case 'PL':
  //             this.sPostalCode = createInputView('text', postalCodePolandValidator, '', 'PostalCode');
  //             this.shippingList.append(this.sPostalCode);
  //             break;
  //         }
  //       }
  //     }
  //   });
  // }
}
