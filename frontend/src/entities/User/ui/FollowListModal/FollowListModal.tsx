import {
  useNavigate,
} from "react-router-dom";

import type {
  FollowUser,
} from "../../../../shared/api/follows";

import cls from "./FollowListModal.module.scss";

type FollowListModalProps = {
  title: string;
  users: FollowUser[];
  currentUserFollowing: FollowUser[];
  currentUserId: string;
  followListLoadingUserId:
    | string
    | null;
  onFollow: (
    user: FollowUser
  ) => void;
  onUnfollow: (
    userId: string
  ) => void;
  onClose: () => void;
};

const FollowListModal = ({
  title,
  users,
  currentUserFollowing,
  currentUserId,
  followListLoadingUserId,
  onFollow,
  onUnfollow,
  onClose,
}: FollowListModalProps) => {
  const navigate = useNavigate();

  const handleUserClick = (
    userId: string
  ) => {
    onClose();

    navigate(
      `/profile/${userId}`
    );
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className={cls.overlay}
      onClick={handleOverlayClick}
    >
      <div className={cls.modal}>
        <div className={cls.header}>
          <h3>{title}</h3>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={cls.list}>
          {users.length === 0 ? (
            <p>
              No users yet.
            </p>
          ) : (
            users.map((user) => {
              const isFollowing =
                currentUserFollowing.some(
                  (followingUser) =>
                    followingUser._id ===
                    user._id
                );

              const isCurrentUser =
                user._id ===
                currentUserId;

              const isLoading =
                followListLoadingUserId ===
                user._id;

              return (
                <div
                  key={user._id}
                  className={cls.user}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleUserClick(
                        user._id
                      )
                    }
                  >
                    <img
                      src={user.image}
                      alt={user.username}
                    />

                    <div>
                      <p>
                        {user.username}
                      </p>

                      <p>
                        {user.fullName}
                      </p>
                    </div>
                  </button>

                  {!isCurrentUser && (
                    <button
                      type="button"
                      onClick={() =>
                        isFollowing
                          ? onUnfollow(
                              user._id
                            )
                          : onFollow(
                              user
                            )
                      }
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Loading..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;