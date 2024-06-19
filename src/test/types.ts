import * as catalogStyle from '../App/Page/CatalogPage/catalog.module.scss';

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
  'main-page',
  'login',
];

export const SOME_ID = 'some-id';

export const SOME_TEXT = 'some-text';

export const emptySpaceValidateValue = ' ';

export const emptyValidateValue = '';

export const emailValidateValues = [
  { value: 'asd@qwe', expected: false },
  { value: 'asd@asd.asd', expected: true },
];

export const passwordValidateFalseValues = ['asd', 'ASD', 'asd', 'asd asd', 'asdasd'];

export const passwordTrueValues = ['Aaaaaaaa1', 'Aaaaaaaa1!'];

export const nameValidateFalseValues = ['as!@d', 'AS123D', ''];

export const nameValidateTrueValue = 'qwerty';

export const dateValidateValues = [
  { value: '01-01-2013', expected: false },
  { value: '01-01-1999', expected: true },
];

export const postalCodeValidateFalseValue = '123123123';

export const BelarusPostalCodeValidateTrueValue = '111111';

export const RussiaPostalCodeValidateTrueValue = '111111';

export const PolandPostalCodeValidateValue = '11-111';
