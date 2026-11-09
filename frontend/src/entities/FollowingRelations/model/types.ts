import type { FollowUser } from "../../../shared/api/follows";

export type FollowState = {
  followers: FollowUser[];
  following: FollowUser[];
  currentUserFollowing: FollowUser[];

  isFollowersLoading: boolean;
  isFollowingLoading: boolean;
  isCurrentUserFollowingLoading: boolean;

  followersRequestId: string | null;
  followingRequestId: string | null;
  currentUserFollowingRequestId: string | null;

  loadingUserId: string | null;

  error: string | null;
};