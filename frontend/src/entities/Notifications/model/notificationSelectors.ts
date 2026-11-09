import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../../app/store/store";

const selectNotifications = (
  state: RootState
) => state.notifications.notifications;

export const selectUnreadNotificationsCount =
  createSelector(
    [selectNotifications],
    (notifications) =>
      notifications.filter(
        (notification) =>
          !notification.read
      ).length
  );