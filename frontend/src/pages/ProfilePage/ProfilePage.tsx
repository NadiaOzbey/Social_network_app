import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import type { User } from "../../entities/User/model/types";
import type { Post } from "../../entities/Post/model/types";
import type { FollowUser } from "../../shared/api/follows";

import ProfileHeader from "../../entities/User/ui/ProfileHeader/ProfileHeader";
import ProfilePostGrid from "../../entities/Post/ui/ProfilePostGrid/ProfilePostGrid";
import FollowListModal from "../../entities/User/ui/FollowListModal/FollowListModal";

import { getProfile } from "../../shared/api/user";
import { getUserPosts } from "../../shared/api/posts";

import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  addFollower,
  removeFollower,
} from "../../entities/FollowingRelations/model/followSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/store/hooks";

import { PageLoader } from "../../shared/ui/PageLoader/PageLoader";

import cls from "./ProfilePage.module.scss";

type FollowListType =
  | "followers"
  | "following"
  | null;

const ProfilePage = () => {
  const { userId } = useParams<{
    userId: string;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    currentUser,
    isLoading: isAuthLoading,
  } = useAppSelector(
    (state) => state.user,
  );

  const {
    followers,
    following,
    currentUserFollowing,
    loadingUserId,
    error: followError,
  } = useAppSelector(
    (state) => state.follow,
  );

  const [profileUser, setProfileUser] =
    useState<User | null>(null);

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [followListType, setFollowListType] =
    useState<FollowListType>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!userId || !currentUser) {
      console.log(
        "PROFILE LOAD SKIPPED",
        {
          userId,
          currentUserId:
            currentUser?._id,
        },
      );

      return;
    }

    console.log(
      "PROFILE EFFECT RUN",
      {
        userId,
        currentUserId:
          currentUser._id,
        refreshPosts:
          location.state?.refreshPosts,
        time:
          new Date().toISOString(),
      },
    );

    const loadProfile =
      async () => {
        console.log(
          "PROFILE LOAD START",
          {
            userId,
            currentUserId:
              currentUser._id,
            refreshPosts:
              location.state?.refreshPosts,
            time:
              new Date().toISOString(),
          },
        );

        try {
          setIsLoading(true);
          setError("");

          console.log(
            "PROFILE DATA REQUEST START",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          const [
            user,
            userPosts,
          ] = await Promise.all([
            getProfile(userId),
            getUserPosts(userId),
          ]);

          console.log(
            "PROFILE DATA REQUEST SUCCESS",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          setProfileUser(user);
          setPosts(userPosts);

          console.log(
            "PROFILE FOLLOW REQUESTS",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          console.log(
            "DISPATCH fetchFollowers",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          dispatch(
            fetchFollowers(userId),
          );

          console.log(
            "DISPATCH fetchFollowing",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          dispatch(
            fetchFollowing(userId),
          );
        } catch (error) {
          console.error(
            "FAILED TO LOAD PROFILE",
            error,
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load profile.",
          );
        } finally {
          console.log(
            "PROFILE LOAD FINISHED",
            {
              userId,
              time:
                new Date().toISOString(),
            },
          );

          setIsLoading(false);
        }
      };

    loadProfile();
  }, [
    userId,
    currentUser,
    location.state?.refreshPosts,
    dispatch,
  ]);

  const handleFollow =
    async (
      targetUser: FollowUser,
    ) => {
      if (!currentUser) {
        return;
      }

      try {
        await dispatch(
          followUser({
            targetUser: {
              _id: targetUser._id,
              username:
                targetUser.username,
              image:
                targetUser.image,
            },
          }),
        ).unwrap();

        dispatch(
          addFollower({
            _id: currentUser._id,
            username:
              currentUser.username,
            fullName:
              currentUser.fullName,
            image:
              currentUser.image ??
              "",
          }),
        );
      } catch (error) {
        console.error(
          "Failed to follow user:",
          error,
        );
      }
    };

  const handleUnfollow =
    async (
      targetUserId: string,
    ) => {
      if (!currentUser) {
        return;
      }

      try {
        await dispatch(
          unfollowUser(targetUserId),
        ).unwrap();

        dispatch(
          removeFollower(
            currentUser._id,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to unfollow user:",
          error,
        );
      }
    };

  const handleProfileFollow =
    async () => {
      if (!profileUser) {
        return;
      }

      await handleFollow({
        _id: profileUser._id,
        username:
          profileUser.username,
        fullName:
          profileUser.fullName,
        image:
          profileUser.image ?? "",
      });
    };

  const handleFollowListFollow =
    async (
      user: FollowUser,
    ) => {
      await handleFollow(user);
    };

  const handleFollowListUnfollow =
    async (
      userId: string,
    ) => {
      await handleUnfollow(userId);
    };

  if (
    isAuthLoading ||
    isLoading
  ) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return (
      <div className={cls.error}>
        User not found
      </div>
    );
  }

  if (
    error ||
    !profileUser
  ) {
    return (
      <div className={cls.error}>
        {error ||
          "User not found"}
      </div>
    );
  }

  const isOwnProfile =
    currentUser._id ===
    profileUser._id;

  const isFollowing =
    currentUserFollowing.some(
      (user) =>
        user._id ===
        profileUser._id,
    );

  return (
    <div className={cls.container}>
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        postsCounter={posts.length}
        followersCounter={
          followers.length
        }
        followingCounter={
          following.length
        }
        isFollowing={isFollowing}
        isFollowLoading={
          loadingUserId ===
          profileUser._id
        }
        onFollow={
          handleProfileFollow
        }
        onUnfollow={() =>
          handleUnfollow(
            profileUser._id,
          )
        }
        onFollowersClick={() =>
          setFollowListType(
            "followers",
          )
        }
        onFollowingClick={() =>
          setFollowListType(
            "following",
          )
        }
      />

      <ProfilePostGrid
        posts={posts}
        onPostClick={(post) =>
          navigate(
            `/post/${post._id}`,
            {
              state: {
                fromProfile:
                  true,
              },
            },
          )
        }
      />

      {followListType && (
        <FollowListModal
          title={
            followListType ===
            "followers"
              ? "Followers"
              : "Following"
          }
          users={
            followListType ===
            "followers"
              ? followers
              : following
          }
          currentUserFollowing={
            currentUserFollowing
          }
          currentUserId={
            currentUser._id
          }
          followListLoadingUserId={
            loadingUserId
          }
          onFollow={
            handleFollowListFollow
          }
          onUnfollow={
            handleFollowListUnfollow
          }
          onClose={() =>
            setFollowListType(null)
          }
        />
      )}

      {followError && (
        <div className={cls.error}>
          {followError}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;