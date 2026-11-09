import cls from "./NotFoundPage.module.scss";
import smartphones from '../../shared/assets/smartphones.jpg'

const NotFoundPage = () => {
  return (
    <div className={cls.container}>
        <div className={cls.left}>
            <img src={smartphones} alt="two smartphone screens with ICHGram app opened" />
        </div>
        <div className={cls.right}>
            <h1>Oops! Page Not Found (404 Error)</h1>
            <p>We're sorry, but the page you're looking for doesn't seem to exist.</p>
            <p>If you typed the URL manually, please double-check the spelling.</p>
            <p>If you clicked on a link, it may be outdated or broken.</p>
        </div>
      
    </div>
  );
};

export default NotFoundPage;