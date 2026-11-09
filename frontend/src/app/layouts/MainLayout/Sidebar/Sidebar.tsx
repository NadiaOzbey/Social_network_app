import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  useAppSelector,
} from "../../../../app/store/hooks";

import {
  selectUnreadNotificationsCount,
} from "../../../../entities/Notifications/model/notificationSelectors";

import logo from "../../../../shared/assets/logo.svg";
import home from "../../../../shared/assets/home.svg";
import search from "../../../../shared/assets/search.svg";
import compass from "../../../../shared/assets/compass.svg";
import message from "../../../../shared/assets/message.svg";
import heart from "../../../../shared/assets/heart.svg";
import plus from "../../../../shared/assets/plus.svg";
import circle_logo from "../../../../shared/assets/circle_logo.svg";

import home_black from "../../../../shared/assets/home_black.svg";
import search_black from "../../../../shared/assets/search_black.svg";
import compass_black from "../../../../shared/assets/compass_black.svg";
import message_black from "../../../../shared/assets/message_black.svg";
import heart_black from "../../../../shared/assets/heart_black.svg";
import plus_black from "../../../../shared/assets/plus_black.svg";

import cls from "./Sidebar.module.scss";

const Sidebar = () => {
  const location = useLocation();

  const {
    currentUser,
  } = useAppSelector(
    (state) => state.user,
  );

  const unreadNotificationsCount =
    useAppSelector(
      selectUnreadNotificationsCount,
    );

  return (
    <div className={cls.Sidebar}>
      <div
        className={
          cls.sidebarHeading
        }
      >
        <img
          src={logo}
          alt="ICHGram logo"
        />
      </div>

      <ul>
        <li className={cls.menuItem}>
          <NavLink to="/">
            <span className={cls.icon}>
              <img
                src={home}
                alt="home icon"
              />

              <img
                src={home_black}
                alt=""
              />
            </span>

            <p>Home</p>
          </NavLink>
        </li>

        <li className={cls.menuItem}>
          <NavLink
            to="/search"
            state={{
              backgroundLocation:
                location,
            }}
          >
            <span className={cls.icon}>
              <img
                src={search}
                alt="search icon"
              />

              <img
                src={search_black}
                alt=""
              />
            </span>

            <p>Search</p>
          </NavLink>
        </li>

        <li className={cls.menuItem}>
          <NavLink to="/explore">
            <span className={cls.icon}>
              <img
                src={compass}
                alt="compass icon"
              />

              <img
                src={compass_black}
                alt=""
              />
            </span>

            <p>Explore</p>
          </NavLink>
        </li>

        <li className={cls.menuItem}>
          <div
            className={cls.messages}
          >
            <span className={cls.icon}>
              <img
                src={message}
                alt="message icon"
              />
            </span>

            <p>Messages</p>
          </div>
        </li>

        <li className={cls.menuItem}>
          <NavLink
            to="/notifications"
            state={{
              backgroundLocation:
                location,
            }}
          >
            <span className={cls.icon}>
              <img
                src={heart}
                alt="heart icon"
              />

              <img
                src={heart_black}
                alt=""
              />
            </span>

            <p>
              Notifications

              {unreadNotificationsCount >
                0 && (
                <span
                  className={
                    cls.notificationCount
                  }
                >
                  {" "}
                  (
                  {
                    unreadNotificationsCount
                  }
                  )
                </span>
              )}
            </p>
          </NavLink>
        </li>

        <li className={cls.menuItem}>
          <NavLink
            to="/create"
            state={{
              backgroundLocation:
                location,
            }}
          >
            <span className={cls.icon}>
              <img
                src={plus}
                alt="icon depicting a button with a plus on it"
              />

              <img
                src={plus_black}
                alt=""
              />
            </span>

            <p>Create</p>
          </NavLink>
        </li>
      </ul>

      <div
        className={cls.sidebarBottom}
      >
        {currentUser && (
          <NavLink
            to={`/profile/${currentUser._id}`}
          >
            <img
              src={circle_logo}
              alt="icon depicting a round button with an ICH logo on it"
            />

            <p>Profile</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;