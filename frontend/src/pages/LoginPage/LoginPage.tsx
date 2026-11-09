import cls from "./LoginPage.module.scss";
import smartphones from "../../shared/assets/smartphones.jpg";
import { LoginForm } from "../../features/auth/ui/LoginForm/LoginForm";
import Container from "../../shared/ui/Container/Container";

const LoginPage = () => {
  return (
    <div className={cls.loginPage}>
      <Container>
        <div className={cls.left}>
          <img src={smartphones} alt="Instagram photos on smartphone screens" />
        </div>
        <div className={cls.right}>
          <LoginForm />
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
