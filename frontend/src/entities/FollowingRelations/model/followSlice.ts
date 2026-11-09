import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { FollowUser } from "../../../shared/api/follows";
import type { FollowState } from "./types";

import {
  getFollowers,
  getFollowing,
  followUser as followUserApi,
  unfollowUser as unfollowUserApi,
} from "../../../shared/api/follows";

type FollowTargetUser = {
  _id: string;
  username: string;
  image: string;
};

type FollowActionData = {
  targetUser: FollowTargetUser;
};

const initialState: FollowState = {
  followers: [],
  following: [],
  currentUserFollowing: [],

  isFollowersLoading: false,
  isFollowingLoading: false,
  isCurrentUserFollowingLoading: false,

  followersRequestId: null,
  followingRequestId: null,
  currentUserFollowingRequestId: null,

  loadingUserId: null,

  error: null,
};

export const fetchFollowers = createAsyncThunk<
  FollowUser[],
  string,
  { rejectValue: string }
>(
  "follow/fetchFollowers",
  async (
    userId,
    { rejectWithValue },
  ) => {
    try {
      return await getFollowers(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message,
        );
      }

      return rejectWithValue(
        "Failed to fetch followers",
      );
    }
  },
);

export const fetchFollowing = createAsyncThunk<
  FollowUser[],
  string,
  { rejectValue: string }
>(
  "follow/fetchFollowing",
  async (
    userId,
    { rejectWithValue },
  ) => {
    try {
      return await getFollowing(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message,
        );
      }

      return rejectWithValue(
        "Failed to fetch following",
      );
    }
  },
);

export const fetchCurrentUserFollowing =
  createAsyncThunk<
    FollowUser[],
    string,
    { rejectValue: string }
  >(
    "follow/fetchCurrentUserFollowing",
    async (
      userId,
      { rejectWithValue },
    ) => {
      try {
        const result =
          await getFollowing(userId);

        return result;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message,
          );
        }

        return rejectWithValue(
          "Failed to fetch current user following",
        );
      }
    },
  );

export const followUser = createAsyncThunk<
  FollowUser,
  FollowActionData,
  { rejectValue: string }
>(
  "follow/followUser",
  async (
    { targetUser },
    { rejectWithValue },
  ) => {
    try {
      await followUserApi(
        targetUser._id,
      );

      return targetUser as FollowUser;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message,
        );
      }

      return rejectWithValue(
        "Failed to follow user",
      );
    }
  },
);

export const unfollowUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "follow/unfollowUser",
  async (
    userId,
    { rejectWithValue },
  ) => {
    try {
      await unfollowUserApi(userId);

      return userId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message,
        );
      }

      return rejectWithValue(
        "Failed to unfollow user",
      );
    }
  },
);

const followSlice = createSlice({
  name: "follow",
  initialState,

  reducers: {
    setCurrentUserFollowing: (
      state: FollowState,
      action: PayloadAction<FollowUser[]>,
    ) => {
      state.currentUserFollowing =
        action.payload;
    },

    addFollower: (
      state: FollowState,
      action: PayloadAction<FollowUser>,
    ) => {
      const alreadyExists =
        state.followers.some(
          (user) =>
            user._id ===
            action.payload._id,
        );

      if (!alreadyExists) {
        state.followers.unshift(
          action.payload,
        );
      }
    },

    removeFollower: (
      state: FollowState,
      action: PayloadAction<string>,
    ) => {
      state.followers =
        state.followers.filter(
          (user) =>
            user._id !==
            action.payload,
        );
    },

    addFollowing: (
      state: FollowState,
      action: PayloadAction<FollowUser>,
    ) => {
      const alreadyExists =
        state.following.some(
          (user) =>
            user._id ===
            action.payload._id,
        );

      if (!alreadyExists) {
        state.following.unshift(
          action.payload,
        );
      }
    },

    removeFollowing: (
      state: FollowState,
      action: PayloadAction<string>,
    ) => {
      state.following =
        state.following.filter(
          (user) =>
            user._id !==
            action.payload,
        );
    },

    clearFollowState: (
      state: FollowState,
    ) => {
      state.followers = [];
      state.following = [];
      state.currentUserFollowing = [];

      state.isFollowersLoading = false;
      state.isFollowingLoading = false;
      state.isCurrentUserFollowingLoading =
        false;

      state.followersRequestId = null;
      state.followingRequestId = null;
      state.currentUserFollowingRequestId =
        null;

      state.loadingUserId = null;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchFollowers.pending,
        (state, action) => {
          state.isFollowersLoading = true;
          state.followersRequestId =
            action.meta.requestId;
          state.error = null;
        },
      )
      .addCase(
        fetchFollowers.fulfilled,
        (state, action) => {
          if (
            state.followersRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.followers =
            action.payload;

          state.isFollowersLoading =
            false;

          state.followersRequestId =
            null;
        },
      )
      .addCase(
        fetchFollowers.rejected,
        (state, action) => {
          if (
            state.followersRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.isFollowersLoading =
            false;

          state.followersRequestId =
            null;

          state.error =
            action.payload ??
            "Failed to fetch followers";
        },
      )

      .addCase(
        fetchFollowing.pending,
        (state, action) => {
          state.isFollowingLoading = true;

          state.followingRequestId =
            action.meta.requestId;

          state.error = null;
        },
      )
      .addCase(
        fetchFollowing.fulfilled,
        (state, action) => {
          if (
            state.followingRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.following =
            action.payload;

          state.isFollowingLoading =
            false;

          state.followingRequestId =
            null;
        },
      )
      .addCase(
        fetchFollowing.rejected,
        (state, action) => {
          if (
            state.followingRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.isFollowingLoading =
            false;

          state.followingRequestId =
            null;

          state.error =
            action.payload ??
            "Failed to fetch following";
        },
      )

      .addCase(
        fetchCurrentUserFollowing.pending,
        (state, action) => {
          state.isCurrentUserFollowingLoading =
            true;

          state.currentUserFollowingRequestId =
            action.meta.requestId;

          state.error = null;
        },
      )
      .addCase(
        fetchCurrentUserFollowing.fulfilled,
        (state, action) => {
          if (
            state.currentUserFollowingRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.currentUserFollowing =
            action.payload;

          state.isCurrentUserFollowingLoading =
            false;

          state.currentUserFollowingRequestId =
            null;
        },
      )
      .addCase(
        fetchCurrentUserFollowing.rejected,
        (state, action) => {
          if (
            state.currentUserFollowingRequestId !==
            action.meta.requestId
          ) {
            return;
          }

          state.isCurrentUserFollowingLoading =
            false;

          state.currentUserFollowingRequestId =
            null;

          state.error =
            action.payload ??
            "Failed to fetch current user following";
        },
      )

      .addCase(
        followUser.pending,
        (state, action) => {
          const targetUser =
            action.meta.arg.targetUser;

          state.loadingUserId =
            targetUser._id;

          const alreadyFollowing =
            state.currentUserFollowing.some(
              (user) =>
                user._id ===
                targetUser._id,
            );

          if (!alreadyFollowing) {
            state.currentUserFollowing.push(
              targetUser as FollowUser,
            );
          }

          state.isCurrentUserFollowingLoading =
            false;

          state.error = null;
        },
      )
      .addCase(
        followUser.fulfilled,
        (state, action) => {
          state.loadingUserId = null;

          const alreadyFollowing =
            state.currentUserFollowing.some(
              (user) =>
                user._id ===
                action.payload._id,
            );

          if (!alreadyFollowing) {
            state.currentUserFollowing.push(
              action.payload,
            );
          }
        },
      )
      .addCase(
        followUser.rejected,
        (state, action) => {
          const targetUserId =
            action.meta.arg.targetUser._id;

          state.loadingUserId = null;

          state.currentUserFollowing =
            state.currentUserFollowing.filter(
              (user) =>
                user._id !==
                targetUserId,
            );

          state.error =
            action.payload ??
            "Failed to follow user";
        },
      )

      .addCase(
        unfollowUser.pending,
        (state, action) => {
          state.loadingUserId =
            action.meta.arg;

          state.isCurrentUserFollowingLoading =
            false;

          state.error = null;
        },
      )
      .addCase(
        unfollowUser.fulfilled,
        (state, action) => {
          state.loadingUserId = null;

          state.currentUserFollowing =
            state.currentUserFollowing.filter(
              (user) =>
                user._id !==
                action.payload,
            );
        },
      )
      .addCase(
        unfollowUser.rejected,
        (state, action) => {
          state.loadingUserId = null;

          state.error =
            action.payload ??
            "Failed to unfollow user";
        },
      );
  },
});

export const {
  setCurrentUserFollowing,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  clearFollowState,
} = followSlice.actions;

export default followSlice.reducer;