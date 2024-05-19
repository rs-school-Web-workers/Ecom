import Component from '../../utils/base-component';
import Page from '../Page';
import { createInputView } from '../../components/input/inputComponent';
import { email, password } from '../../utils/validations';
import { getClient, isLogged, signinClient } from '../../utils/api/Client';
export default class LoginPage extends Page {
  constructor() {
    super(['login']);
    const btn = new Component('button', ['btn']);
    btn.setTextContent('Login');
    const emailInput = createInputView('email', [], email);
    const passwordInput = createInputView('email', [], password);
    btn.getElement<HTMLElement>().addEventListener('click', () => {
      console.log(isLogged());
      if (isLogged())
        getClient()!
          .me()
          .orders()
          .get()
          .execute()
          .then((el) => console.log(el));
      else
        signinClient('asdasd@asd.asd', 'qwe', 'qweqwe', 'asd')!
          .me()
          .orders()
          .get()
          .execute()
          .then((el) => console.log(el));
    });
    this.container?.append(emailInput, passwordInput, btn.getElement());
  }
}
