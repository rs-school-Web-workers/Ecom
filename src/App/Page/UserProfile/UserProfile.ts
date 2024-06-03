import { InputNewControl } from '../../components/inputText/inputTextComponent';
import { getUserProfile } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import Page from '../Page';
import * as userProfileStyle from './userprofile.module.scss';

const emailValidator = [
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
  {
    validate: (value: string) => /^\w+@\w+\.\w+$/.test(value.trim()),
    message: 'Invalid email address format',
  },
];

const {
  userProfile,
  // userProfile__formContainer,
  // userProfile__form,
  // userProfile__title,
  // userProfile__aboutText,
  // userProfile__btnListShow,
  // userProfile__listShipping,
  // userProfile__listBilling,
  // userProfile__label,
  // userProfile__inputCheck,
  // userProfile__formBtn,
  // userProfile__footer,
  // userProfile__footerLink,
  // userProfileImgWrapper,
} = userProfileStyle;

export class UserProfilePage extends Page {
  private personalUserInformationContainer = new Component('div', []);
  private addressesUserInformationContainer = new Component('div', []);
  private titlePersonalContainer = new Component('h1', []);
  private titleAddressesContainer = new Component('h1', []);

  elem: InputNewControl;

  constructor() {
    super([userProfile]);
    console.log(getUserProfile());
    this.elem = new InputNewControl('email', emailValidator, 'Email address', 'Enter your e-mail', true, true);
    this.elem.value = 'lox';
    this.container?.append(this.elem);
  }
}
