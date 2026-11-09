import cls from "./NotificationItem.module.scss";

type NotificationItemProps = {
  username: string;
  avatar: string;
  type:
    | "like"
    | "comment"
    | "follow";
  timestamp: string;
  postImage?: string;
  isRead: boolean;
  onClick: () => void;
};

const NotificationItem = ({
  username,
  avatar,
  type,
  timestamp,
  postImage,
  isRead,
  onClick,
}: NotificationItemProps) => {
  const actionText = {
    like: "liked your photo.",
    comment: "commented on your photo.",
    follow: "started following you.",
  };

  return (
    <button
      type="button"
      className={`${cls.container} ${
        isRead ? cls.read : ""
      }`}
      onClick={onClick}
    >
      <img
        className={cls.avatar}
        src={avatar}
        alt={`Profile photo of ${username}`}
      />

      <div className={cls.content}>
        <span className={cls.username}>
          {username}
        </span>{" "}

        <span className={cls.action}>
          {actionText[type]}
        </span>{" "}

        <span className={cls.timestamp}>
          {timestamp}
        </span>
      </div>

      {postImage && (
        <div className={cls.postImageWrapper}>
          <img
            className={cls.postImage}
            src={postImage}
            alt="Post preview"
          />
        </div>
      )}
    </button>
  );
};

export default NotificationItem;