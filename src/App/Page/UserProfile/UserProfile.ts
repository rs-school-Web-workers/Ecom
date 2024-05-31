import Page from '../Page';
import * as userProfileStyle from './userprofile.module.scss';

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
  constructor() {
    super([userProfile]);
  }
}
