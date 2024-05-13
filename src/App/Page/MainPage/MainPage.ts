import Component from '../../utils/base-component';
import Page from '../Page';
import './main.scss';
import { DEFINITION_BLOCK_TEXT, MAIN_PAGE, SLOGAN_BLOCK_TEXT, commonBlockClassNames } from './types';

export default class MainPage extends Page {
  constructor() {
    super([MAIN_PAGE]);
    this.initPage();
  }

  initPage() {
    const commonBlock: HTMLDivElement = this.createCommonBlock();
    this.container?.append(commonBlock);
  }

  createCommonBlock() {
    const commonBlock: Component = new Component('div', [commonBlockClassNames.COMMON_BLOCK]);
    const sloganBlock: Component = new Component('div', [commonBlockClassNames.SLOGAN_BLOCK]);
    sloganBlock.setTextContent(SLOGAN_BLOCK_TEXT);
    const definitionBlock: Component = new Component('div', [commonBlockClassNames.DEFINITION_BLOCK]);
    definitionBlock.setTextContent(DEFINITION_BLOCK_TEXT);
    commonBlock.setChildren(sloganBlock.getElement<HTMLDivElement>(), definitionBlock.getElement<HTMLDivElement>());
    return commonBlock.getElement<HTMLDivElement>();
  }
}
