declare module '*.jpg';
declare module '*.mp4';
declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module global {
  const fetch: object;
}
