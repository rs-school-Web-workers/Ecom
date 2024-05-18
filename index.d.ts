declare module '*.jpg';
declare module '*.mp4';
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
