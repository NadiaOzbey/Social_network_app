import cls from "./ResetPage.module.scss";

import { ResetForm } from "../../features/auth/ui/ResetForm/ResetForm";
import Container from "../../shared/ui/Container/Container";
import logo from '../../shared/assets/logo.svg'

const ResetPage = () => {
  return (
    <div className={cls.resetPage}>
      <div className={cls.header}>
        <img src={logo} alt="ICHGram logo" />
      </div>
      <Container>
        
        <div>
          <ResetForm />
        </div>
      </Container>
    </div>
  );
};

export default ResetPage;
