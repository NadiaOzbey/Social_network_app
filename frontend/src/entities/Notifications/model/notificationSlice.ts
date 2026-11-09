import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Notification,
} from "./types";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../../shared/api/notifications";

type NotificationState = {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
};

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

export const fetchNotifications =
  createAsyncThunk<
    Notification[],
    void,
    { rejectValue: string }
  >(
    "notifications/fetchNotifications",
    async (
      _,
      { rejectWithValue },
    ) => {
      try {
        const notifications =
          await getNotifications();

        return notifications;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message,
          );
        }

        return rejectWithValue(
          "Failed to load notifications",
        );
      }
    },
  );

export const markNotificationAsReadThunk =
  createAsyncThunk<
    Notification,
    string,
    { rejectValue: string }
  >(
    "notifications/markNotificationAsRead",
    async (
      notificationId,
      { rejectWithValue },
    ) => {
      try {
        const notification =
          await markNotificationAsRead(
            notificationId,
          );

        return notification;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message,
          );
        }

        return rejectWithValue(
          "Failed to mark notification as read",
        );
      }
    },
  );

const notificationSlice =
  createSlice({
    name: "notifications",
    initialState,

    reducers: {
      addNotification: (
        state,
        action: PayloadAction<Notification>,
      ) => {
        const notification =
          action.payload;

        const alreadyExists =
          state.notifications.some(
            (item) =>
              item._id ===
              notification._id,
          );

        if (alreadyExists) {
          return;
        }

        state.notifications.unshift(
          notification,
        );
      },

      clearNotifications: (
        state,
      ) => {
        state.notifications = [];
        state.isLoading = false;
        state.error = null;
      },
    },

    extraReducers: (
      builder,
    ) => {
      builder

        .addCase(
          fetchNotifications.pending,
          (state) => {
            state.isLoading = true;
            state.error = null;
          },
        )

        .addCase(
          fetchNotifications.fulfilled,
          (
            state,
            action,
          ) => {
            state.notifications =
              action.payload;

            state.isLoading = false;
            state.error = null;
          },
        )

        .addCase(
          fetchNotifications.rejected,
          (
            state,
            action,
          ) => {
            state.notifications = [];
            state.isLoading = false;

            state.error =
              action.payload ??
              "Failed to load notifications";
          },
        )

        .addCase(
          markNotificationAsReadThunk.fulfilled,
          (
            state,
            action,
          ) => {
            const notification =
              state.notifications.find(
                (item) =>
                  item._id ===
                  action.payload._id,
              );

            if (!notification) {
              return;
            }

            notification.read = true;
          },
        );
    },
  });

export const {
  addNotification,
  clearNotifications,
} =
  notificationSlice.actions;

export default notificationSlice.reducer;