import {
  useNavigate,
} from "react-router-dom";

import cls from "./ProfileActions.module.scss";

type ProfileActionsProps = {
  isOwnProfile: boolean;
  userId: string;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
};

const ProfileActions = ({
  isOwnProfile,
  userId,
  isFollowing,
  isFollowLoading,
  onFollow,
  onUnfollow,
}: ProfileActionsProps) => {
  const navigate = useNavigate();

  const handleEditProfile =
    () => {
      navigate(
        `/profile/${userId}/edit`
      );
    };

  return (
    <div className={cls.container}>
      {isOwnProfile ? (
        <button className={cls.editProfileButton}
          type="button"
          onClick={
            handleEditProfile
          }
        >
          Edit profile
        </button>
      ) : (
        <>
          <button
          className={cls.followButton}
            type="button"
            onClick={
              isFollowing
                ? onUnfollow
                : onFollow
            }
            disabled={
              isFollowLoading
            }
          >
            {isFollowing
              ? "Unfollow"
              : "Follow"}
          </button>

          <button type="button" className={cls.messageButton}>
            Message
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;