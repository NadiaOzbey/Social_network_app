import type { ReactNode } from "react";
import cls from "./Container.module.scss";

type ContainerProps = {
  children: ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return <div className={cls.container}>{children}</div>;
};

export default Container;