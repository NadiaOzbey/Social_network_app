import {
  NavLink,
  useLocation,
} from "react-router-dom";

import cls from "./Footer.module.scss";

const Footer = () => {
  const location = useLocation();

  const modalState = {
    backgroundLocation:
      location,
  };

  return (
    <div className={cls.container}>
      <ul>
        <li>
          <NavLink to="/">
            <p>Home</p>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/search"
            state={modalState}
          >
            <p>Search</p>
          </NavLink>
        </li>

        <li>
          <NavLink to="/explore">
            <p>Explore</p>
          </NavLink>
        </li>

        <li>
          <div className={cls.messages}>
            <p>Messages</p>
          </div>
        </li>

        <li>
          <NavLink
            to="/notifications"
            state={modalState}
          >
            <p>Notifications</p>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create"
            state={modalState}
          >
            <p>Create</p>
          </NavLink>
        </li>
      </ul>

      <div className={cls.copyright}>
        <p>© 2024 ICHgram</p>
      </div>
    </div>
  );
};

export default Footer;