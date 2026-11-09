import { useNavigate } from "react-router-dom";

import cls from "./NotificationsList.module.scss";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/store/hooks";

import {
  markNotificationAsReadThunk,
} from "../../model/notificationSlice";

import NotificationItem from "../NotificationItem/NotificationItem";

const formatTimestamp = (
  createdAt: string,
): string => {
  const createdDate = new Date(
    createdAt,
  );

  const now = new Date();

  const differenceInSeconds = Math.floor(
    (now.getTime() -
      createdDate.getTime()) /
      1000,
  );

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60,
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60,
  );

  if (differenceInHours < 24) {
    return `${differenceInHours} h ago`;
  }

  const differenceInDays = Math.floor(
    differenceInHours / 24,
  );

  if (differenceInDays < 7) {
    return `${differenceInDays} d ago`;
  }

  return createdDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
};

const NotificationsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    notifications,
    error,
  } = useAppSelector(
    (state) => state.notifications,
  );

  const handleNotificationClick = (
    notificationId: string,
    isRead: boolean,
    type:
      | "like"
      | "comment"
      | "follow",
    postId?: string,
    actorId?: string,
  ) => {
    if (!isRead) {
      dispatch(
        markNotificationAsReadThunk(
          notificationId,
        ),
      );
    }

    if (
      (type === "like" ||
        type === "comment") &&
      postId
    ) {
      navigate(`/post/${postId}`);
      return;
    }

    if (
      type === "follow" &&
      actorId
    ) {
      navigate(
        `/profile/${actorId}`,
      );
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (notifications.length === 0) {
    return (
      <p>
        No notifications yet.
      </p>
    );
  }

  return (
    <div className={cls.container}>
      {notifications.map(
        (notification) => {
          if (!notification.actor) {
            return null;
          }

          return (
            <NotificationItem
              key={notification._id}
              username={
                notification.actor
                  .username
              }
              avatar={
                notification.actor
                  .image
              }
              type={
                notification.type
              }
              timestamp={formatTimestamp(
                notification.createdAt,
              )}
              postImage={
                notification.post
                  ?.image
              }
              isRead={
                notification.read
              }
              onClick={() =>
                handleNotificationClick(
                  notification._id,
                  notification.read,
                  notification.type,
                  notification.post
                    ?._id,
                  notification.actor
                    ?._id,
                )
              }
            />
          );
        },
      )}
    </div>
  );
};

export default NotificationsList;