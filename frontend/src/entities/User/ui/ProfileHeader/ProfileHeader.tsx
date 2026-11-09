import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { User } from "../../model/types";

import ProfileActions from "../ProfileActions/ProfileActions";

import cls from "./ProfileHeader.module.scss";
import ringlet2 from "../../../../shared/assets/ringlet2.svg";
import link from "../../../../shared/assets/link.svg";

type ProfileHeaderProps = {
  user: User;
  isOwnProfile: boolean;
  postsCounter: number;
  followersCounter: number;
  followingCounter: number;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
};

const ProfileHeader = ({
  user,
  isOwnProfile,
  postsCounter,
  followersCounter,
  followingCounter,
  isFollowing,
  isFollowLoading,
  onFollow,
  onUnfollow,
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) => {
  const [isBioExpanded, setIsBioExpanded] =
    useState(false);

  const [hasMoreBio, setHasMoreBio] =
    useState(false);

  const bioRef =
    useRef<HTMLDivElement>(null);

  const API_URL =
    import.meta.env.VITE_API_URL;

  const avatarUrl =
    `${API_URL}/api/users/${user._id}/image`;

  useEffect(() => {
    const element = bioRef.current;

    if (!element) {
      return;
    }

    const checkBioHeight = () => {
      const lineHeight = 18;
      const maxHeight = lineHeight * 3;

      setHasMoreBio(
        element.scrollHeight > maxHeight,
      );
    };

    checkBioHeight();

    const resizeObserver =
      new ResizeObserver(() => {
        checkBioHeight();
      });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [user.bio]);

  useEffect(() => {
    setIsBioExpanded(false);
  }, [user.bio]);

  return (
    <div className={cls.container}>
      <div className={cls.left}>
        <div className={cls.avatar}>
          <img
            className={cls.avatarImage}
            src={avatarUrl}
            alt="avatar"
          />

          <img
            className={cls.avatarBorder}
            src={ringlet2}
            alt="picture frame"
          />
        </div>
      </div>

      <div className={cls.right}>
        <div className={cls.first_line}>
          <h3>{user.username}</h3>

          <ProfileActions
            isOwnProfile={isOwnProfile}
            userId={user._id}
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        </div>

        <div className={cls.second_line}>
          <p>
            <span className={cls.counter}>
              {postsCounter}
            </span>{" "}
            <span>posts</span>
          </p>

          <button
            type="button"
            onClick={onFollowersClick}
          >
            <span className={cls.counter}>
              {followersCounter}
            </span>{" "}
            <span>followers</span>
          </button>

          <button
            type="button"
            onClick={onFollowingClick}
          >
            <span className={cls.counter}>
              {followingCounter}
            </span>{" "}
            <span>following</span>
          </button>
        </div>

        <div className={cls.third_line}>
          <div
            ref={bioRef}
            className={
              isBioExpanded
                ? cls.bioExpanded
                : cls.bioCollapsed
            }
          >
            {user.bio
              .split(/\n\s*\n/)
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
          </div>

          {hasMoreBio && (
            <button
              type="button"
              className={cls.moreButton}
              onClick={() =>
                setIsBioExpanded(
                  (previous) => !previous,
                )
              }
            >
              {isBioExpanded
                ? "...less"
                : "...more"}
            </button>
          )}
        </div>

        {user.externalLink.url && (
          <div className={cls.fourth_line}>
            <img
              src={link}
              alt="link sign"
            />

            <a
              href={user.externalLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.externalLink.title ||
                user.externalLink.url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;