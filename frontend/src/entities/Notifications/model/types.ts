export type NotificationType =
  | "like"
  | "comment"
  | "follow";

export type NotificationActor = {
  _id: string;
  username: string;
  image: string;
};

export type NotificationPost = {
  _id: string;
  image: string;
};

export type Notification = {
  _id: string;
  recipient: string;
  actor: NotificationActor;
  type: NotificationType;
  post?: NotificationPost;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  notifications: Notification[];
};