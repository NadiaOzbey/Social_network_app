import { apiFetch } from "./apiFetch";

import type {
  Notification,
  NotificationsResponse,
} from "../../entities/Notifications/model/types";

const API_URL = import.meta.env.VITE_API_URL;

// Получить уведомления
// Защищённый маршрут: GET /api/notifications
export const getNotifications = async (): Promise<
  Notification[]
> => {
  const response = await apiFetch(
    `${API_URL}/api/notifications`,
  );

  const data: NotificationsResponse & {
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch notifications",
    );
  }

  return data.notifications;
};

// Пометить уведомление как прочитанное
// Защищённый маршрут:
// PATCH /api/notifications/:notificationId/read
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const response = await apiFetch(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
    },
  );

  const data: {
    notification: Notification;
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to mark notification as read",
    );
  }

  return data.notification;
};