import cls from "./SignUpPage.module.scss";
import { SignUpForm } from "../../features/auth/ui/SignUpForm/SignUpForm";
import Container from "../../shared/ui/Container/Container";

const SignUpPage = () => {
  return (
    <div className={cls.signUpPage}>
      <Container>
        <div>
          <SignUpForm />
        </div>
      </Container>
    </div>
  );
};

export default SignUpPage;
