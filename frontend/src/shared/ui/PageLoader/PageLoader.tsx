import cls from "./PageLoader.module.scss";

export const PageLoader = () => {
  return (
    <div className={cls.loaderWrap}>
      <span className={cls.loader} />
    </div>
  );
};
