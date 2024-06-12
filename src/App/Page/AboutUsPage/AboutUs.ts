import Component from '../../utils/base-component';
import Page from '../Page';
import * as aboutUsStyles from './aboutus.module.scss';

const { aboutUs, aboutUsTitle, aboutUsAbout, aboutUsTeam, aboutUsAboutContainer, aboutUsAboutTitle, aboutUsAboutText } =
  aboutUsStyles;

export class AboutUsPage extends Page {
  private wrapperAbout = new Component('div', [aboutUsAbout]);
  private wrapperTeam = new Component('div', [aboutUsTeam]);
  private title = new Component('h1', [aboutUsTitle]);
  constructor() {
    super([aboutUs]);
    this.createAbout();
    this.init();
  }

  init() {
    this.title.setTextContent('Meet our team');
    this.container?.append(this.wrapperAbout.getElement(), this.title.getElement(), this.wrapperTeam.getElement());
  }

  createAbout() {
    const containerAboutUs = new Component('div', [aboutUsAboutContainer]);
    const title = new Component('h2', [aboutUsAboutTitle]);
    title.setTextContent('Our story');
    const textAboutUs = new Component('p', [aboutUsAboutText]);
    textAboutUs.setTextContent(
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore iusto assumenda ratione natus nihil numquam repellat? Explicabo, quos? Corrupti modi deleniti nihil natus tenetur dolores accusantium fuga iusto debitis ipsam?'
    );
    containerAboutUs.setChildren(title.getElement(), textAboutUs.getElement());
    this.wrapperAbout.setChildren(containerAboutUs.getElement());
  }

  // createCard(img: string, name: string, role: string, shortBio: string, ghLink: string) {
  //   const card = new Component('div', []);
  //   const cardImg = new Component('img', []);
  //   const cardName = new Component('h3', []);
  //   const cardRole = new Component('h4', []);
  // }
}
