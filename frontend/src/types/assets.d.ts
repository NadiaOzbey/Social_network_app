declare module "*.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}