import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { User } from "./types";

import {
  getCurrentUser,
} from "../../../shared/api/user";

type UserState = {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  currentUser: null,
  isLoading: true,
  error: null,
};

export const fetchCurrentUser =
  createAsyncThunk<
    User,
    void,
    { rejectValue: string }
  >(
    "user/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
      try {
        const user =
          await getCurrentUser();

        return user;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message,
          );
        }

        return rejectWithValue(
          "Failed to load current user",
        );
      }
    },
  );

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (
      state,
      action: PayloadAction<User>,
    ) => {
      state.currentUser =
        action.payload;

      state.isLoading = false;
      state.error = null;
    },

    clearUser: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCurrentUser.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action) => {
          state.currentUser =
            action.payload;

          state.isLoading = false;
          state.error = null;
        },
      )

      .addCase(
        fetchCurrentUser.rejected,
        (state, action) => {
          state.currentUser = null;
          state.isLoading = false;

          state.error =
            action.payload ===
            "No access token provided"
              ? null
              : action.payload ??
                "Failed to load current user";
        },
      );
  },
});

export const {
  setUser,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;