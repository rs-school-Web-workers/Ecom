export enum PagePath {
  LOGIN = '/login',
  MAIN = '/main',
  REGISTRATION = '/registration',
  NOT_FOUND = '/not-found',
  PRODUCTS = '/products',
  USERPROFILE = '/user-profile',
  ABOUTUS = '/about-us',
}

export const SECTION_NAME = '{section_name}';

export const ID_ELEMENT = '{id}';

export interface PageInfo {
  pagePath: string;
  render: (section_name?: string, id?: string) => void;
}

export interface requestAdressBar {
  page: string;
  section_name: string;
  resource: string;
}
