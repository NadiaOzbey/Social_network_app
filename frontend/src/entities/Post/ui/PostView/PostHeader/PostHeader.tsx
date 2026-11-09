import type { Post } from "../../../model/types";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import type { MouseEvent } from "react";

import cls from "./PostHeader.module.scss";

import ringlet2 from "../../../../../shared/assets/ringlet2.svg";

type PostHeaderProps = {
  post: Post;
  isOwnPost: boolean;
  onMenuClick?: () => void;
  onClose?: () => void;
  isFollowing: boolean;
  isFollowLoading: boolean;
  handleFollow: () => void;
};

const PostHeader = ({
  post,
  isOwnPost,
  onMenuClick,
  isFollowing,
  isFollowLoading,
  handleFollow,
}: PostHeaderProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(
      `/profile/${post.author._id}`,
    );
  };

  return (
    <div className={cls.header}>
      <div className={cls.lefties}>
        <Link
          className={cls.avatarLink}
          to={`/profile/${post.author._id}`}
          onClick={handleProfileClick}
          aria-label={`Open ${post.author.username}'s profile`}
        >
          <div className={cls.avatar}>
            <img
              className={cls.avatarImage}
              src={post.author.image}
              alt={`avatar of ${post.author.username}`}
            />

            <img
              className={cls.avatarBorder}
              src={ringlet2}
              alt=""
            />
          </div>
        </Link>

        <Link
          className={cls.usernameLink}
          to={`/profile/${post.author._id}`}
          onClick={handleProfileClick}
        >
          <h3>
            {post.author.username}
          </h3>
        </Link>

        {!isOwnPost && (
          <div
            className={
              cls.foreignAccountOption
            }
          >
            <p>·</p>

            <button
              className={
                cls.followButton
              }
              type="button"
              onClick={handleFollow}
              disabled={
                isFollowLoading
              }
            >
              {isFollowLoading
                ? "..."
                : isFollowing
                  ? "Following"
                  : "Follow"}
            </button>
          </div>
        )}
      </div>

      {isOwnPost && (
        <button
          className={cls.menuButton}
          type="button"
          onClick={onMenuClick}
          aria-label="Post menu"
        >
          ...
        </button>
      )}
    </div>
  );
};

export default PostHeader;