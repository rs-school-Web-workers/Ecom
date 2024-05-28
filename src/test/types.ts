export enum ContentClassesTest {
  '/' = 'main-page',
  '/login' = 'login',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  '/main' = 'main-page',
  '/registration' = 'registration',
  '/not-found' = 'not-found-page',
  '/products' = 'products-page',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  '/not-found-example' = 'not-found-page',
}

export enum PagePathTest {
  INIT = '/',
  LOGIN = '/login',
  MAIN = '/main',
  REGISTRATION = '/registration',
  NOT_FOUND = '/not-found',
  PRODUCTS = '/products',
  OTHER_NOT_FOUND = '/not-found-example',
}

export const ContentClassesHeaderArrayTest = ['main-page', 'login', 'registration', 'login'];

export const SOME_ID = 'some-id';

export const SOME_TEXT = 'some-text';
