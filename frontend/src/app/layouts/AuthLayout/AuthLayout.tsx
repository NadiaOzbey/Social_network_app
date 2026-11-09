import { Outlet } from "react-router-dom";
import cls from "./AuthLayout.module.scss";

const AuthLayout = () => {
  return (
    <div className={cls.layout}>
      <Outlet /> 
    </div>
  );
};

export default AuthLayout;