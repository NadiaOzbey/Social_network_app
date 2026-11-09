import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import EmojiPicker, {
  type EmojiClickData,
} from "emoji-picker-react";

import type { PostComment } from "../../../../../shared/api/comments";

import cls from "./PostComments.module.scss";

import heart from "../../../../../shared/assets/heart.svg";
import heart_black from "../../../../../shared/assets/heart_black.svg";
import heart_red from "../../../../../shared/assets/heart_red.svg";
import message from "../../../../../shared/assets/message.svg";
import smiley from "../../../../../shared/assets/smiley.svg";

type CommentLikeState = {
  liked: boolean;
  likesCount: number;
};

type PostCommentsProps = {
  comments: PostComment[];
  commentsCount: number;
  commentText: string;
  setCommentText: (value: string) => void;
  isCommentsLoading: boolean;
  isCommentSubmitting: boolean;
  commentsError: string;
  deletingCommentId: string | null;
  commentLikes: Record<string, CommentLikeState>;
  commentLikeLoadingId: string | null;
  currentUserId?: string;
  handleCommentLike: (commentId: string) => void;
  handleCommentSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  handleDeleteComment: (commentId: string) => void;
  isLiked: boolean;
  likesCount: number;
  isLikeLoading: boolean;
  likesError: string;
  handleLike: () => void;
  formatPostDate: (dateString: string) => string;
  onClose?: () => void;
};

const PostComments = ({
  comments,
  commentText,
  setCommentText,
  isCommentsLoading,
  isCommentSubmitting,
  commentsError,
  commentLikes,
  commentLikeLoadingId,
  handleCommentLike,
  handleCommentSubmit: submitComment,
  isLiked,
  likesCount,
  isLikeLoading,
  handleLike,
  formatPostDate,
}: PostCommentsProps) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] =
    useState(false);

  const emojiWrapperRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmojiPickerOpen) {
      return;
    }

    const handleClickOutside = (
      event: globalThis.MouseEvent,
    ) => {
      const target = event.target as Node;

      if (
        emojiWrapperRef.current &&
        !emojiWrapperRef.current.contains(target)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isEmojiPickerOpen]);

  const handleEmojiClick = (
    emojiData: EmojiClickData,
  ) => {
    setCommentText(
      `${commentText}${emojiData.emoji}`,
    );
  };

  const handleCommentSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    setIsEmojiPickerOpen(false);

    submitComment(event);
  };

  const handleProfileClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    userId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(`/profile/${userId}`);
  };

  return (
    <div className={cls.commentsContainer}>
      <div className={cls.commentsList}>
        {commentsError && (
          <p className={cls.error}>
            {commentsError}
          </p>
        )}

        {isCommentsLoading ? (
          <p className={cls.message}>
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className={cls.message}>
            No comments yet.
          </p>
        ) : (
          <div>
            {comments.map((comment) => {
              const commentLike =
                commentLikes[comment._id];

              const isCommentLiked =
                commentLike?.liked ?? false;

              return (
                <div
                  className={cls.commentItem}
                  key={comment._id}
                >
                  <div className={cls.left}>
                    <Link
                      className={cls.avatarLink}
                      to={`/profile/${comment.user._id}`}
                      onClick={(event) =>
                        handleProfileClick(
                          event,
                          comment.user._id,
                        )
                      }
                      aria-label={`Open ${comment.user.username}'s profile`}
                    >
                      <img
                        className={cls.avatarImage}
                        src={comment.user.image}
                        alt={`avatar of ${comment.user.username}`}
                      />
                    </Link>
                  </div>

                  <div className={cls.middle}>
                    <div className={cls.first_line}>
                      <Link
                        className={cls.username}
                        to={`/profile/${comment.user._id}`}
                        onClick={(event) =>
                          handleProfileClick(
                            event,
                            comment.user._id,
                          )
                        }
                      >
                        {comment.user.username}
                      </Link>

                      <p>{comment.text}</p>
                    </div>

                    <div className={cls.second_line}>
                      <p className={cls.timeStamp}>
                        {formatPostDate(
                          comment.createdAt,
                        )}
                      </p>

                      <p className={cls.likesCounter}>
                        Likes:{" "}
                        {commentLike?.likesCount ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className={cls.right}>
                    <button
                      type="button"
                      onClick={() =>
                        handleCommentLike(
                          comment._id,
                        )
                      }
                      disabled={
                        commentLikeLoadingId ===
                        comment._id
                      }
                      aria-label={
                        isCommentLiked
                          ? "Unlike comment"
                          : "Like comment"
                      }
                    >
                      <img
                        src={
                          isCommentLiked
                            ? heart_red
                            : heart
                        }
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={cls.likeSection}>
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
              alt=""
            />
          </button>

          <img src={message} alt="" />
        </div>

        <div className={cls.likesInfo}>
          <p className={cls.likes}>
            Likes: {likesCount}
          </p>

          <p className={cls.timeStamp}>
            {formatPostDate(
              comments.length > 0
                ? comments[0].createdAt
                : new Date().toISOString(),
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleCommentSubmit}>
        <div
          ref={emojiWrapperRef}
          className={cls.emojiWrapper}
        >
          <button
            className={cls.emojiButton}
            type="button"
            onClick={() =>
              setIsEmojiPickerOpen(
                (previous) => !previous,
              )
            }
            aria-label="Add emoji"
            disabled={isCommentSubmitting}
          >
            <img src={smiley} alt="" />
          </button>

          {isEmojiPickerOpen && (
            <div className={cls.emojiPicker}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        <textarea
          value={commentText}
          onChange={(event) =>
            setCommentText(event.target.value)
          }
          placeholder="Add comment"
          disabled={isCommentSubmitting}
        />

        <button
          className={cls.sendButton}
          type="submit"
          disabled={
            isCommentSubmitting ||
            commentText.trim() === ""
          }
        >
          {isCommentSubmitting
            ? "Sending..."
            : "Send"}
        </button>
      </form>
    </div>
  );
};

export default PostComments;