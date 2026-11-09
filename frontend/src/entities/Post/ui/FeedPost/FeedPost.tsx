import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type { Post } from "../../model/types";

import {
  getPostLikes,
  toggleLike,
} from "../../../../shared/api/likes";

import {
  getPostComments,
} from "../../../../shared/api/comments";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/store/hooks";

import {
  followUser,
  unfollowUser,
} from "../../../../entities/FollowingRelations/model/followSlice";

import cls from "./FeedPost.module.scss";

import heart from "../../../../shared/assets/heart.svg";
import heart_black from "../../../../shared/assets/heart_black.svg";
import empty_message from "../../../../shared/assets/empty_message.svg";
import ringlet2 from "../../../../shared/assets/ringlet2.svg";

const DESCRIPTION_MAX_LENGTH = 150;

type FeedPostProps = {
  post: Post;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (updatedPost: Post) => void;
};

const formatPostDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < 60) return `${diffInSeconds}s`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) return `${diffInDays}d`;

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);

  return `${diffInYears} year${diffInYears === 1 ? "" : "s"}`;
};

const FeedPost = ({ post }: FeedPostProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const API_URL = import.meta.env.VITE_API_URL;

  const { currentUser } = useAppSelector(
    (state) => state.user,
  );

  const {
    currentUserFollowing,
    loadingUserId,
  } = useAppSelector(
    (state) => state.follow,
  );

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState(false);

  const isOwnPost =
    currentUser?._id === post.author._id;

  const isFollowing =
    currentUserFollowing.some(
      (user) => user._id === post.author._id,
    );

  const isFollowLoading =
    loadingUserId === post.author._id;

  const avatarUrl =
    `${API_URL}/api/users/${post.author._id}/image`;

  const postImageUrl =
    `${API_URL}/api/posts/${post._id}/image`;

  const isDescriptionLong =
    post.description.length >
    DESCRIPTION_MAX_LENGTH;

  const getCollapsedDescription = () => {
    if (!isDescriptionLong) {
      return post.description;
    }

    const truncatedDescription =
      post.description.slice(
        0,
        DESCRIPTION_MAX_LENGTH,
      );

    const lastSpace =
      truncatedDescription.lastIndexOf(" ");

    if (lastSpace > 0) {
      return (
        truncatedDescription.slice(0, lastSpace) +
        "..."
      );
    }

    return `${truncatedDescription}...`;
  };

  const descriptionText =
    isDescriptionExpanded
      ? post.description
      : getCollapsedDescription();

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const data = await getPostLikes(
          post._id,
        );

        setLikesCount(data.likesCount);

        const currentUserLike =
          data.likes.some(
            (like) =>
              like.user?._id ===
              currentUser?._id,
          );

        setIsLiked(currentUserLike);
      } catch (error) {
        console.error(
          "Failed to load likes:",
          error,
        );
      }
    };

    loadLikes();
  }, [post._id, currentUser?._id]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data =
          await getPostComments(post._id);

        setCommentsCount(
          data.commentsCount,
        );
      } catch (error) {
        console.error(
          "Failed to load comments:",
          error,
        );
      }
    };

    loadComments();
  }, [post._id]);

  const handleLike = async () => {
    if (isLikeLoading) return;

    try {
      setIsLikeLoading(true);

      const data = await toggleLike(
        post._id,
      );

      setIsLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error(
        "Failed to toggle like:",
        error,
      );
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleFollow = () => {
    if (isOwnPost || isFollowLoading) {
      return;
    }

    if (isFollowing) {
      dispatch(
        unfollowUser(post.author._id),
      );

      return;
    }

    dispatch(
      followUser({
        targetUser: post.author,
      }),
    );
  };

  const handleOpenPostModal = () => {
    navigate(`/post/${post._id}`, {
      state: {
        backgroundLocation: location,
      },
    });
  };

  return (
    <div className={cls.container}>
      <div className={cls.heading}>
        <Link
          className={cls.avatarLink}
          to={`/profile/${post.author._id}`}
          aria-label={`Open ${post.author.username}'s profile`}
        >
          <div className={cls.avatar}>
            <img
              className={cls.avatarImage}
              src={avatarUrl}
              alt={`avatar of ${post.author.username}`}
              loading="lazy"
            />

            <img
              className={cls.avatarBorder}
              src={ringlet2}
              alt=""
            />
          </div>
        </Link>

        <div className={cls.headingText}>
          <Link
            className={cls.usernameLink}
            to={`/profile/${post.author._id}`}
          >
            {post.author.username}
          </Link>

          <p className={cls.timeStamp}>
            · {formatPostDate(post.createdAt)} ·
          </p>

          {!isOwnPost && (
            <button
              type="button"
              onClick={handleFollow}
              disabled={isFollowLoading}
            >
              {isFollowing
                ? "following"
                : "follow"}
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className={cls.postImageButton}
        onClick={handleOpenPostModal}
        aria-label={`Open post by ${post.author.username}`}
      >
        <img
          className={cls.postImage}
          src={postImageUrl}
          alt={`Post by ${post.author.username}`}
          loading="lazy"
        />
      </button>

      <div className={cls.bottom}>
        <div className={cls.iconStrip}>
          <button
            type="button"
            onClick={handleLike}
            disabled={isLikeLoading}
            aria-label={
              isLiked
                ? "Unlike post"
                : "Like post"
            }
          >
            <img
              src={
                isLiked
                  ? heart_black
                  : heart
              }
              alt="like"
            />
          </button>

          <button
            type="button"
            onClick={handleOpenPostModal}
            aria-label="Open comments"
          >
            <img
              src={empty_message}
              alt="comment"
            />
          </button>
        </div>

        <p className={cls.likes}>
          {likesCount}{" "}
          {likesCount === 1
            ? "like"
            : "likes"}
        </p>

        <div className={cls.description}>
          <span
            className={cls.descriptionContent}
          >
            <span className={cls.username}>
              {post.author.username}
            </span>{" "}

            <span
              className={
                isDescriptionExpanded
                  ? cls.descriptionTextExpanded
                  : cls.descriptionText
              }
            >
              {descriptionText}
            </span>
          </span>

          {isDescriptionLong && (
            <button
              type="button"
              className={cls.moreButton}
              onClick={() =>
                setIsDescriptionExpanded(
                  (previous) =>
                    !previous,
                )
              }
            >
              {isDescriptionExpanded
                ? "...less"
                : "...more"}
            </button>
          )}
        </div>

        <button
          type="button"
          className={cls.commentsButton}
          onClick={handleOpenPostModal}
        >
          View all comments (
          {commentsCount})
        </button>
      </div>
    </div>
  );
};

export default FeedPost;