import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../../entities/User/model/userSlice";
import followReducer from "../../entities/FollowingRelations/model/followSlice";
import notificationReducer from "../../entities/Notifications/model/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    follow: followReducer,
    notifications: notificationReducer,
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;