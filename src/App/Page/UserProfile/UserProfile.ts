import { InputTextControl } from '../../components/inputText/inputTextComponent';
import {
  getUserProfile,
  changeUserProfile,
  changeAddress,
  destroyClient,
  passwordReset,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
  addBillingAddress,
  removeBillingAddress,
  addShippingAddress,
  removeShippingAddress,
  removeAddress,
  addAddress,
} from '../../utils/api/Client';
import Component from '../../utils/base-component';
import Page from '../Page';
import {
  cityValidator,
  dateOfBirthdayValidator,
  passwordValidator,
  emailValidator,
  nameValidator,
  postalCodeBelarusValidator,
  postalCodePolandValidator,
  postalCodeRussiaValidator,
  streetValidator,
  surnameValidator,
} from '../../utils/validationsInputText';
import * as userProfileStyle from './userprofile.module.scss';
import { countries } from '../../utils/countries';
import { addressItem, getUserProfileData /*, changeAddress */ } from './types';
import { SelectNewControl } from '../../components/selectNew/selectNewComponent';
import { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';
import { Router } from '../../Router/Router';
import { PagePath } from '../../Router/types';

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
  success,
  unsuccess,
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

interface dataForChangeAddress {
  streetName: InputTextControl;
  streetNumber: InputTextControl;
  city: InputTextControl;
  selectCountry: SelectNewControl;
  postalCode: InputTextControl | undefined;
}
interface dataForAddresses {
  streetNameValue: string;
  streetNumberValue: string;
  postalCodeValue: string;
  countryValue: string;
  cityValue: string;
  defaultBillingValue?: boolean;
  defaultShippingValue?: boolean;
  shippingValue?: boolean;
  billingValue?: boolean;
  id?: string;
}
interface dataBoxesForAddAddress {
  checkboxDefaultBilling: HTMLInputElement;
  checkboxDefaultShipping: HTMLInputElement;
  checkboxBilling: HTMLInputElement;
  checkboxShipping: HTMLInputElement;
}

export class UserProfilePage extends Page {
  private emailInput = new InputTextControl('email', emailValidator, 'Email address', 'Enter your e-mail', true);
  private passwordInput = new InputTextControl('password', passwordValidator, 'Password', 'Enter your password');
  private newPasswordInput = new InputTextControl('password', passwordValidator, 'New Password', 'Enter new password');
  private nameInput = new InputTextControl('text', nameValidator, 'Name', 'Enter your name', true);
  private surnameInput = new InputTextControl('text', surnameValidator, 'Surname', 'Enter your surname', true);
  private dateOfBirthday = new InputTextControl('date', dateOfBirthdayValidator, 'Date of birth', '', true);
  private wrapperForm = new Component('div', [userProfile__formContainer]);
  private addressesContainer = new Component('div', [userProfile__addressesContainer]);
  private addressesList = new Component('div', [userProfile__formContainer_addresses]);
  private containerImg = new Component('div', [userProfileImgWrapper]);
  private router;

  constructor(router: Router) {
    super([userProfile]);
    this.router = router;
    this.container?.append(
      this.wrapperForm.getElement<HTMLDivElement>(),
      this.addressesContainer.getElement<HTMLDivElement>(),
      this.containerImg.getElement<HTMLDivElement>()
    );
    this.initAddressesContainer();
    this.setDataPersonalUserInformation();
    this.setDataAddressesUserInformation();
  }
  async setDataPersonalUserInformation() {
    const { body } = await getUserProfile();
    const { firstName, lastName, dateOfBirth, email } = body as getUserProfileData;
    this.createFormPersonalUserInformation(firstName, lastName, dateOfBirth, email);
    this.createFormPassword();
  }
  async setDataAddressesUserInformation() {
    const { body } = await getUserProfile();
    const { addresses, defaultBillingAddressId, defaultShippingAddressId, shippingAddressIds, billingAddressIds } =
      body as getUserProfileData;
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
    const titleForAdd = new Component('h1', [userProfile__title]);
    titleForAdd.setTextContent('Add address');
    title.setTextContent('User Addresses');
    const subtitleList = new Component('h3', [userProfile__aboutText]);
    const subtitleForAdd = new Component('h3', [userProfile__aboutText]);
    subtitleList.setTextContent('Your List of Addresses');
    subtitleForAdd.setTextContent('Enter all necessary data to add a form');
    const formAddAddress = this.createFormToAddAddress();
    this.addressesContainer.setChildren(
      titleForAdd.getElement(),
      subtitleForAdd.getElement(),
      formAddAddress.getElement<HTMLFormElement>(),
      title.getElement(),
      subtitleList.getElement(),
      this.addressesList.getElement()
    );
  }

  createFormPassword() {
    const form = new Component('form', [userProfile__form]);
    const title = new Component('h2', [userProfile__title]);
    title.setTextContent('Change Password');
    const buttonSubmit = new Component('button', [userProfile__formBtn]);
    buttonSubmit.getElement<HTMLButtonElement>().type = 'submit';
    buttonSubmit.setTextContent('Save Changes');
    form.getElement<HTMLFormElement>().addEventListener('submit', (event) => this.submitSavePassword(event));
    form.setChildren(
      title.getElement(),
      this.passwordInput,
      this.newPasswordInput,
      buttonSubmit.getElement<HTMLButtonElement>()
    );
    this.wrapperForm.setChildren(form.getElement<HTMLFormElement>());
  }

  async submitSavePassword(event: Event) {
    event.preventDefault();
    if (this.passwordInput.getSuccessForSubmit() && this.newPasswordInput.getSuccessForSubmit()) {
      try {
        const { version } = (await getUserProfile()).body;
        await passwordReset(version, this.passwordInput.value, this.newPasswordInput.value);
        destroyClient();
        this.router.navigate(PagePath.MAIN);
        this.router.renderPageView(PagePath.MAIN);
      } catch (resp) {
        const err = (resp as ClientResponse).body as ErrorResponse;
        if ((err as ErrorResponse).errors?.filter((el) => el.code === 'InvalidCurrentPassword')[0]) {
          [this.passwordInput, this.newPasswordInput].forEach((el) => {
            el.setErrorInvalidPassword(err.message);
          });
          if (event.target instanceof HTMLFormElement) this.setUnSuccess(event.target);
          [this.passwordInput, this.newPasswordInput].forEach((el) => {
            // el.resetStateInvalidPassword();
            el.resetStateForSubmit();
          });
        }
      }
    } else {
      [this.passwordInput, this.newPasswordInput].forEach((el) => {
        if (!el.getSuccessForSubmit()) {
          el.checkStateForSubmit();
        }
      });
    }
  }

  createFormPersonalUserInformation(
    nameValue: string,
    surnameValue: string,
    dateOfBirthValue: string,
    emailValue: string
  ) {
    const title = new Component('h2', [userProfile__title]);
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
      if (event.target instanceof HTMLFormElement) {
        this.setSuccess(event.target);
      }
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

  createFormToAddAddress() {
    const form = new Component('form', [userProfile__FormList]);
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
      templateDefaultCheckboxShipping.getElement()
    );
    const streetName = new InputTextControl('text', streetValidator, 'Street', 'Enter street');
    const streetNumber = new InputTextControl('text', [], 'Street Number', 'Enter street number');
    const city = new InputTextControl('text', cityValidator, 'City', 'Enter city');
    const selectCountry = new SelectNewControl(countries);
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
    let postalCode: InputTextControl | undefined;
    const propertyData = {
      streetName,
      streetNumber,
      city,
      selectCountry,
      postalCode,
    };
    const propertyDataCheckboxes = {
      checkboxDefaultBilling,
      checkboxDefaultShipping,
      checkboxBilling,
      checkboxShipping,
    };
    form.getElement<HTMLFormElement>().addEventListener(
      'selectNewValue',
      (e) => {
        const target = e as CustomEvent<{ value: string }>;
        if (target.detail.value) {
          if (postalCode) postalCode.remove();
          switch (target.detail.value) {
            case 'BY':
              postalCode = new InputTextControl('text', postalCodeBelarusValidator, 'Postal Code', 'Enter postal code');
              selectCountry.insertAdjacentElement('afterend', postalCode);
              propertyData.postalCode = postalCode;
              break;
            case 'RU':
              postalCode = new InputTextControl('text', postalCodeRussiaValidator, 'Postal Code', 'Enter postal code');
              selectCountry.insertAdjacentElement('afterend', postalCode);
              propertyData.postalCode = postalCode;
              break;
            case 'PL':
              postalCode = new InputTextControl('text', postalCodePolandValidator, 'Postal Code', 'Enter postal code');
              selectCountry.insertAdjacentElement('afterend', postalCode);
              propertyData.postalCode = postalCode;
              break;
          }
        }
      },
      { capture: true, passive: true }
    );
    form
      .getElement<HTMLFormElement>()
      .addEventListener('submit', (event) => this.submitFormAddAddress(event, propertyData, propertyDataCheckboxes));
    form.setChildren(
      wrapperDefaultBillingAndShippingCheckbox.getElement(),
      streetName,
      streetNumber,
      city,
      wrapperBillingAndShippingCheckbox.getElement(),
      selectCountry,
      buttonSubmit.getElement<HTMLButtonElement>()
    );
    return form;
  }
  async submitFormAddAddress(event: Event, addressData: dataForChangeAddress, checkboxesData: dataBoxesForAddAddress) {
    event.preventDefault();
    const { streetName, streetNumber, city, selectCountry, postalCode } = addressData;
    const { checkboxDefaultBilling, checkboxDefaultShipping, checkboxBilling, checkboxShipping } = checkboxesData;
    const arrAddressData = Object.values(addressData) as InputTextControl[] | SelectNewControl[];
    const arrCheckboxesData = Object.values(checkboxesData) as HTMLInputElement[];
    if (
      streetName.getSuccessForSubmit() &&
      streetNumber.getSuccessForSubmit() &&
      city.getSuccessForSubmit() &&
      selectCountry.getSuccessForSubmit()
    ) {
      if (postalCode?.getSuccessForSubmit()) {
        const { version } = (await getUserProfile()).body;
        const address = {
          city: city.value,
          country: selectCountry.getValue(),
          postalCode: postalCode?.value || '',
          streetName: streetName.value,
          streetNumber: streetNumber.value,
        };
        await addAddress(version, address);
        if (checkboxDefaultBilling.checked && checkboxDefaultShipping.checked) {
          try {
            const { version, addresses } = (await getUserProfile()).body;
            const { id } = addresses.slice(addresses.length - 1)[0];
            await setDefaultBillingAddress(version, id);
            const { version: newValueVersion } = (await getUserProfile()).body;
            await setDefaultShippingAddress(newValueVersion, id);
          } catch (error) {
            console.error(error);
          }
        } else if (checkboxDefaultBilling.checked) {
          const { version, addresses } = (await getUserProfile()).body;
          const { id } = addresses.slice(addresses.length - 1)[0];
          await setDefaultBillingAddress(version, id);
        } else if (checkboxDefaultShipping.checked) {
          const { version, addresses } = (await getUserProfile()).body;
          const { id } = addresses.slice(addresses.length - 1)[0];
          await setDefaultShippingAddress(version, id);
        }
        if (checkboxBilling.checked && checkboxShipping.checked) {
          try {
            const { version, addresses } = (await getUserProfile()).body;
            const { id } = addresses.slice(addresses.length - 1)[0];
            await addBillingAddress(version, id);
            const { version: newValueVersion } = (await getUserProfile()).body;
            await addShippingAddress(newValueVersion, id);
          } catch (error) {
            console.error(error);
          }
        } else if (checkboxBilling.checked) {
          const { version, addresses } = (await getUserProfile()).body;
          const { id } = addresses.slice(addresses.length - 1)[0];
          await addBillingAddress(version, id);
        } else if (checkboxShipping.checked) {
          const { version, addresses } = (await getUserProfile()).body;
          const { id } = addresses.slice(addresses.length - 1)[0];
          await addShippingAddress(version, id);
        }
        arrCheckboxesData.forEach((el) => (el.checked = false));
        arrAddressData.forEach((el) => el.resetStateForSubmit());
        postalCode.remove();
        if (event.target instanceof HTMLFormElement) {
          this.setSuccess(event.target);
        }
        while (this.addressesList.getElement<HTMLDivElement>().firstChild) {
          this.addressesList.getElement<HTMLDivElement>().firstChild?.remove();
        }
        this.setDataAddressesUserInformation();
      } else {
        postalCode?.checkStateForSubmit();
      }
    } else {
      arrAddressData.forEach((el) => {
        if (el) {
          if (!el.getSuccessForSubmit()) {
            el.checkStateForSubmit();
          }
        }
      });
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
  }: dataForAddresses) {
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
    const streetName = new InputTextControl('text', streetValidator, 'Street', 'Enter street', true);
    const streetNumber = new InputTextControl('text', [], 'Street Number', 'Enter street number', true);
    const city = new InputTextControl('text', cityValidator, 'City', 'Enter city', true);
    const selectCountry = new SelectNewControl(countries);
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

    /** Добавление данных */

    form.setId(id);
    streetName.value = streetNameValue;
    streetNumber.value = streetNumberValue;
    city.value = cityValue;
    selectCountry.setValue(countryValue);
    let postalCode: InputTextControl | undefined;
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
      form.getElement<HTMLFormElement>().addEventListener(
        'selectNewValue',
        (e) => {
          const target = e as CustomEvent<{ value: string }>;
          if (target.detail.value) {
            switch (target.detail.value) {
              case 'BY':
                postalCode.changeValidations(postalCodeBelarusValidator);
                break;
              case 'RU':
                postalCode.changeValidations(postalCodeRussiaValidator);
                break;
              case 'PL':
                postalCode.changeValidations(postalCodePolandValidator);
                break;
            }
          }
        },
        { capture: true, passive: true }
      );
    }

    checkboxDefaultBilling.checked = defaultBillingValue;
    checkboxDefaultShipping.checked = defaultShippingValue;
    checkboxShipping.checked = shippingValue;
    checkboxBilling.checked = billingValue;
    form.setChildren(
      wrapperDefaultBillingAndShippingCheckbox.getElement(),
      streetName,
      streetNumber,
      city,
      wrapperBillingAndShippingCheckbox.getElement(),
      selectCountry,
      postalCode!,
      buttonSubmit.getElement<HTMLButtonElement>()
    );
    buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    checkboxDefaultBilling.addEventListener('change', (event) =>
      this.handlerDefaultCheckboxes(event, 'default-billing')
    );
    checkboxDefaultShipping.addEventListener('change', (event) =>
      this.handlerDefaultCheckboxes(event, 'default-shipping')
    );
    checkboxShipping.addEventListener('change', (e) => this.handlerCheckBoxes(e, 'shipping'));
    checkboxBilling.addEventListener('change', (e) => this.handlerCheckBoxes(e, 'billing'));
    btnDelete.getElement<HTMLButtonElement>().addEventListener('click', (e) => this.deleteAddress(e));
    form.getElement<HTMLFormElement>().addEventListener(
      'inputStateChange',
      (e: Event) => {
        const customEvent = e as CustomEvent<{ state: boolean }>;
        if (
          customEvent.detail.state &&
          streetName.getSuccess() &&
          streetNumber.getSuccess() &&
          city.getSuccess() &&
          postalCode?.getSuccess() &&
          selectCountry.getSuccess()
        ) {
          buttonSubmit.getElement<HTMLButtonElement>().disabled = false;
        } else {
          buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
        }
      },
      { capture: true, passive: true }
    );
    this.addressesList.setChildren(form.getElement<HTMLFormElement>());
    const propertyData = {
      streetName,
      streetNumber,
      city,
      selectCountry,
      postalCode,
    };
    form
      .getElement<HTMLFormElement>()
      .addEventListener('submit', (e) => this.submitFormAddressesUserInformation(e, propertyData, buttonSubmit));
  }

  async submitFormAddressesUserInformation(event: Event, propertyData: dataForChangeAddress, buttonSubmit: Component) {
    event.preventDefault();
    const { version } = (await getUserProfile()).body;
    const { streetName, streetNumber, city, selectCountry, postalCode } = propertyData;
    let id;
    if (event.target instanceof HTMLElement) {
      id = event.target.id;
    }
    const address = {
      city: city.value,
      country: selectCountry.getValue(),
      id,
      postalCode: postalCode?.value || '',
      streetName: streetName.value,
      streetNumber: streetNumber.value,
    };
    const arr = [streetName, streetNumber, city, postalCode];
    if (
      streetName.getSuccess() &&
      streetNumber.getSuccess() &&
      city.getSuccess() &&
      postalCode?.getSuccess() &&
      selectCountry.getSuccess()
    ) {
      await changeAddress(version, address, id);
      if (event.target instanceof HTMLFormElement) {
        this.setSuccess(event.target);
      }
      streetName.resetState();
      streetNumber.resetState();
      city.resetState();
      postalCode?.resetState();
      selectCountry.resetState();
      buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    } else {
      arr.forEach((input) => {
        if (input) {
          if (!input.getSuccess()) {
            input.checkState();
          }
        }
      });
      buttonSubmit.getElement<HTMLButtonElement>().disabled = true;
    }
  }
  async handlerDefaultCheckboxes(event: Event, className: string) {
    const checkbox = event?.target as HTMLInputElement;
    const id = checkbox?.closest('form')?.id;
    const { version } = (await getUserProfile()).body;
    if (id) {
      if (className === 'default-billing') {
        await setDefaultBillingAddress(version, id);
      } else {
        await setDefaultShippingAddress(version, id);
      }
    }
    const checkboxes = document?.querySelectorAll(`.${className}`);
    if (checkboxes) {
      checkboxes.forEach((element) => {
        if (element instanceof HTMLInputElement && element !== checkbox) {
          (element as HTMLInputElement).checked = false;
        }
      });
    }
  }
  async handlerCheckBoxes(event: Event, className: string) {
    const checkbox = event?.target as HTMLInputElement;
    const id = checkbox?.closest('form')?.id;
    const { version } = (await getUserProfile()).body;
    if (id) {
      if (className === 'billing') {
        if (checkbox.checked) {
          addBillingAddress(version, id);
        } else {
          removeBillingAddress(version, id);
        }
      } else {
        if (checkbox.checked) {
          addShippingAddress(version, id);
        } else {
          removeShippingAddress(version, id);
        }
      }
    }
  }
  async deleteAddress(event: Event) {
    const buttonDelete = event?.target as HTMLInputElement;
    const form = buttonDelete.closest('form');
    const id = buttonDelete?.closest('form')?.id;
    const { version } = (await getUserProfile()).body;
    if (id && form) {
      await removeAddress(version, id);
      form.remove();
    }
  }

  setSuccess(target: HTMLFormElement) {
    target.classList.add(success);
    setTimeout(() => {
      target.classList.remove(success);
    }, 1000);
  }
  setUnSuccess(target: HTMLFormElement) {
    target.classList.add(unsuccess);
    setTimeout(() => {
      target.classList.remove(unsuccess);
    }, 1000);
  }
}
