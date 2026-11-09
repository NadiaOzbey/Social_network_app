import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import cls from "./MainLayout.module.scss";

import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";

import NotificationsSidebar from "./SecondarySidebars/NotificationsSidebar/NotificationsSidebar";
import SearchSidebar from "./SecondarySidebars/SearchSidebar/SearchSidebar";

type MainLayoutProps = {
  pathname: string;
};

const MainLayout = ({
  pathname,
}: MainLayoutProps) => {
  const navigate = useNavigate();

  const isNotificationsOpen =
    pathname === "/notifications";

  const isSearchOpen =
    pathname === "/search";

  const handleOverlayClick = () => {
    navigate(-1);
  };

  return (
    <div className={cls.layout}>
      <div className={cls.top}>
        <Sidebar />

        <div className={cls.content}>
          <Outlet />

          {(isSearchOpen ||
            isNotificationsOpen) && (
            <div
              className={cls.overlay}
              onClick={handleOverlayClick}
            />
          )}

          {isSearchOpen && (
            <SearchSidebar />
          )}

          {isNotificationsOpen && (
            <NotificationsSidebar />
          )}
        </div>
      </div>

      <div className={cls.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;