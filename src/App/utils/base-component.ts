import { isNull } from './base-methods';

interface CallBackParam {
  eventName?: string;
  callback?: (event?: Event) => void;
}

export default class Component {
  protected element: HTMLElement;

  constructor(tag: string, classes?: string[]) {
    this.element = Component.createComponent(tag);
    this.setClasses(classes);
  }

  getElement<T>(): T {
    return <T>this.element;
  }

  static createComponent(tag: string) {
    const component: HTMLElement = document.createElement(tag);
    return component;
  }

  setId(id?: string) {
    if (id) {
      this.element.id = id;
    }
  }

  setTextContent(text: string) {
    if (this.element instanceof HTMLInputElement) {
      this.element.placeholder = text;
    } else {
      this.element.textContent = text;
    }
  }

  setClasses(classes?: string[]) {
    if (typeof classes !== 'undefined') {
      classes.forEach((className) => {
        this.element.classList.add(className);
      });
    }
  }

  setCallback(callbackParam?: CallBackParam) {
    isNull(callbackParam);
    if (typeof callbackParam !== 'undefined') {
      if (typeof callbackParam.eventName !== 'undefined' && typeof callbackParam.callback === 'function') {
        this.element.addEventListener(callbackParam.eventName, (event?: Event) => {
          if (typeof callbackParam.callback !== 'undefined') {
            callbackParam.callback(event);
          }
        });
      }
    }
  }

  setChildren(...children: HTMLElement[]) {
    children.forEach((child: HTMLElement) => {
      this.element.append(child);
    });
  }
}
