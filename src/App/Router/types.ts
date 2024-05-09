export enum PagePath {
  LOGIN = 'login',
  MAIN = 'main',
  REGISTRATION = 'registration',
  NOT_FOUND = 'not-found',
}

export interface PageInfo {
  pagePath: string;
  callback: () => void;
}
