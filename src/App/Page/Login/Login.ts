import { getApiRoot } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import Page from '../Page';
import style from './login.module.scss';
import { createInputView } from '../../components/input/inputComponent';
import { email, password } from '../../utils/validations';

export default class LoginPage extends Page {
  constructor() {
    console.log(style);
    super(['login']);
    const btn = new Component('button', ['btn']);
    btn.setTextContent('Login');
    const emailInput = createInputView('email', [], email);
    const passwordInput = createInputView('email', [], password);
    btn
      .getElement<HTMLElement>()
      .addEventListener('click', () =>
        getApiRoot(
          (emailInput.children[0] as HTMLInputElement).value,
          (passwordInput.children[0] as HTMLInputElement).value
        )
      );
    this.container?.append(emailInput, passwordInput, btn.getElement());
  }
}
