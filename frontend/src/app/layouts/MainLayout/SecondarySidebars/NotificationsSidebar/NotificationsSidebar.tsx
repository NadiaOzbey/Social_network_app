import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import NotificationsList from "../../../../../entities/Notifications/ui/NotificationsList/NotificationsList";

import {
  useAppSelector,
} from "../../../../../app/store/hooks";

import cls from "./NotificationsSidebar.module.scss";

const NotificationsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading =
    useAppSelector(
      (state) =>
        state.notifications.isLoading,
    );

  const handleClose = () => {
    const backgroundLocation =
      location.state?.backgroundLocation;

    if (backgroundLocation) {
      navigate(backgroundLocation);
      return;
    }

    navigate("/");
  };

  return (
    <aside className={cls.container}>
      <h1>Notifications</h1>

      <h3>New</h3>

      {isLoading ? (
        <div className={cls.loaderWrap}>
          <span className={cls.loader} />
        </div>
      ) : (
        <NotificationsList />
      )}
    </aside>
  );
};

export default NotificationsSidebar;