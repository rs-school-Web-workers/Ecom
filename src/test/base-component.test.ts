import Component, { CallBackParam } from '../App/utils/base-component';
import { SOME_ID, SOME_TEXT } from './types';

describe('base-component functionality', () => {
  test(`it should set id`, () => {
    const element: Component = new Component('div');
    element.setId(SOME_ID);
    expect(element.getElement<HTMLDivElement>().id).toBe(SOME_ID);
  });

  test(`it should set textContent`, () => {
    const element: Component = new Component('input');
    element.setTextContent(SOME_TEXT);
    expect(element.getElement<HTMLInputElement>().placeholder).toBe(SOME_TEXT);
  });

  test(`it should set textContent to input element`, () => {
    const element: Component = new Component('input');
    element.setTextContent(SOME_TEXT);
    expect(element.getElement<HTMLInputElement>().placeholder).toBe(SOME_TEXT);
  });

  test(`it should set callback`, () => {
    const element: Component = new Component('button');
    const params: CallBackParam = {
      eventName: 'click',
      callback: () => {
        return true;
      },
    };
    element.setCallback(params);
    expect(() => element.getElement<HTMLButtonElement>().click()).toBeTruthy();
  });
});
