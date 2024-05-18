import { getApiRoot } from '../../utils/api/Client';
import Component from '../../utils/base-component';
import Page from '../Page';
import style from './login.module.scss';

export default class LoginPage extends Page {
  constructor() {
    super([style.login]);
    const btn = new Component('btn', []);
    btn.setTextContent('Login');
    btn.getElement<HTMLElement>().addEventListener('click', () => getApiRoot());
    this.container?.append(btn.getElement());
  }
}
