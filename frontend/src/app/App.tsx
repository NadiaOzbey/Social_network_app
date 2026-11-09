import {
  useEffect,
} from "react";

import AppRouter from "./router/AppRouter";

import {
  useAppDispatch,
  useAppSelector,
} from "./store/hooks";

import {
  fetchCurrentUser,
} from "../entities/User/model/userSlice";

import {
  fetchCurrentUserFollowing,
} from "../entities/FollowingRelations/model/followSlice";

import {
  fetchNotifications,
  addNotification,
} from "../entities/Notifications/model/notificationSlice";

import type {
  Notification,
} from "../entities/Notifications/model/types";

import {
  socket,
  connectSocket,
} from "../shared/socket/socket";

const App = () => {
  const dispatch = useAppDispatch();

  const { currentUser } =
    useAppSelector(
      (state) => state.user,
    );

  // Загружаем текущего пользователя
  // при запуске приложения.
  useEffect(() => {
    const loadCurrentUser =
      async () => {
        await dispatch(
          fetchCurrentUser(),
        );
      };

    loadCurrentUser();
  }, [dispatch]);

  // Загружаем подписки и уведомления
  // для текущего пользователя.
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const followingPromise =
      dispatch(
        fetchCurrentUserFollowing(
          currentUser._id,
        ),
      );

    const notificationsPromise =
      dispatch(
        fetchNotifications(),
      );

    Promise.all([
      followingPromise,
      notificationsPromise,
    ]);
  }, [
    currentUser,
    dispatch,
  ]);

  // Подключаем Socket после загрузки пользователя.
  useEffect(() => {
    if (!currentUser) {
      socket.disconnect();

      return;
    }

    connectSocket();

    return () => {
      socket.disconnect();
    };
  }, [
    currentUser,
  ]);

  // Получаем realtime-уведомления.
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const handleNotification = (
      notification: Notification,
    ) => {
      dispatch(
        addNotification(
          notification,
        ),
      );
    };

    socket.on(
      "notification",
      handleNotification,
    );

    return () => {
      socket.off(
        "notification",
        handleNotification,
      );
    };
  }, [
    currentUser,
    dispatch,
  ]);

  return <AppRouter />;
};

export default App;