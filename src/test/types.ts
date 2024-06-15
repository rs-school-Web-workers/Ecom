import * as catalogStyle from '../App/Page/CatalogPage/catalog.module.scss';
import * as userProfileStyle from '../App/Page/UserProfile/userprofile.module.scss';

export const ContentClassesArrayTest = [
  'main-page',
  'login',
  'main-page',
  'registration',
  'not-found-page',
  `${catalogStyle.catalog}`,
  'not-found-page',
];

export enum PagePathTest {
  INIT = '/',
  LOGIN = '/login',
  MAIN = '/main',
  REGISTRATION = '/registration',
  NOT_FOUND = '/not-found',
  PRODUCTS = '/products',
  OTHER_NOT_FOUND = '/not-found-example',
}

export const ContentClassesHeaderArrayTest = [
  `${catalogStyle.catalog}`,
  'main-page',
  'login',
  'registration',
  `${userProfileStyle.userProfile}`,
  'login',
];

export const SOME_ID = 'some-id';

export const SOME_TEXT = 'some-text';
