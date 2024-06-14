import Component from '../../utils/base-component';
import Page from '../Page';

export class BasketPage extends Page {
  private title = new Component('h1', []);
  constructor() {
    super([]);
  }

  init() {}
}
