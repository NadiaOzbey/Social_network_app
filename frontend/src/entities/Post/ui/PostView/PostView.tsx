import { useEffect, useState, type FormEvent } from "react";

import type { Post } from "../../model/types";

import {
  getPostLikes,
  toggleLike,
} from "../../../../shared/api/likes";

import {
  getPostComments,
  createComment,
  deleteComment,
  getCommentLikes,
  toggleCommentLike,
  type PostComment,
} from "../../../../shared/api/comments";

import {
  followUser,
  unfollowUser,
} from "../../../../entities/FollowingRelations/model/followSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/store/hooks";

import cls from "./PostView.module.scss";

import PostHeader from "./PostHeader/PostHeader";
import PostDescription from "./PostDescription/PostDescription";
import PostComments from "./PostComments/PostComments";

type PostViewProps = {
  post: Post;
  isOwnPost: boolean;
  onMenuClick?: () => void;
  onClose?: () => void;
};

type CommentLikeState = {
  liked: boolean;
  likesCount: number;
};

const PostView = ({
  post,
  isOwnPost,
  onMenuClick,
  onClose,
}: PostViewProps) => {
  const dispatch = useAppDispatch();

  const { currentUser } =
    useAppSelector(
      (state) => state.user,
    );

  const {
    currentUserFollowing,
    loadingUserId,
  } = useAppSelector(
    (state) => state.follow,
  );

  const [currentPost, setCurrentPost] =
    useState(post);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const [isLiked, setIsLiked] =
    useState(false);

  const [likesCount, setLikesCount] =
    useState(0);

  const [isLikeLoading, setIsLikeLoading] =
    useState(false);

  const [likesError, setLikesError] =
    useState("");

  const [followError, setFollowError] =
    useState("");

  const [comments, setComments] =
    useState<PostComment[]>([]);

  const [commentsCount, setCommentsCount] =
    useState(0);

  const [commentText, setCommentText] =
    useState("");

  const [
    isCommentsLoading,
    setIsCommentsLoading,
  ] = useState(true);

  const [
    isCommentSubmitting,
    setIsCommentSubmitting,
  ] = useState(false);

  const [commentsError, setCommentsError] =
    useState("");

  const [
    deletingCommentId,
    setDeletingCommentId,
  ] = useState<string | null>(null);

  const [
    commentLikes,
    setCommentLikes,
  ] = useState<
    Record<string, CommentLikeState>
  >({});

  const [
    commentLikeLoadingId,
    setCommentLikeLoadingId,
  ] = useState<string | null>(null);

  const isFollowing =
    currentUserFollowing.some(
      (user) =>
        user._id ===
        currentPost.author._id,
    );

  const isFollowLoading =
    loadingUserId ===
    currentPost.author._id;

  useEffect(() => {
    const loadLikes = async () => {
      try {
        setLikesError("");

        const data =
          await getPostLikes(
            currentPost._id,
          );

        setLikesCount(
          data.likesCount,
        );

        const currentUserLike =
          data.likes.some(
            (like) =>
              like.user._id ===
              currentUser?._id,
          );

        setIsLiked(
          currentUserLike,
        );
      } catch (error) {
        setLikesError(
          error instanceof Error
            ? error.message
            : "Failed to load likes.",
        );
      }
    };

    loadLikes();
  }, [
    currentPost._id,
    currentUser?._id,
  ]);

  const handleFollow = async () => {
    if (
      isFollowLoading ||
      !currentUser?._id ||
      isOwnPost
    ) {
      return;
    }

    try {
      setFollowError("");

      if (isFollowing) {
        await dispatch(
          unfollowUser(
            currentPost.author._id,
          ),
        ).unwrap();
      } else {
        await dispatch(
          followUser({
            targetUser: {
              _id:
                currentPost.author._id,

              username:
                currentPost.author.username,

              image:
                currentPost.author.image ??
                "",
            },
          }),
        ).unwrap();
      }
    } catch (error) {
      setFollowError(
        error instanceof Error
          ? error.message
          : "Failed to update follow.",
      );
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsCommentsLoading(true);
        setCommentsError("");

        const data =
          await getPostComments(
            currentPost._id,
          );

        setComments(
          data.comments,
        );

        setCommentsCount(
          data.commentsCount,
        );

        const commentLikesEntries =
          await Promise.all(
            data.comments.map(
              async (comment) => {
                try {
                  const likes =
                    await getCommentLikes(
                      comment._id,
                    );

                  return [
                    comment._id,
                    likes,
                  ] as const;
                } catch (error) {
                  return [
                    comment._id,
                    {
                      liked: false,
                      likesCount: 0,
                    },
                  ] as const;
                }
              },
            ),
          );

        setCommentLikes(
          Object.fromEntries(
            commentLikesEntries,
          ),
        );
      } catch (error) {
        setCommentsError(
          error instanceof Error
            ? error.message
            : "Failed to load comments.",
        );
      } finally {
        setIsCommentsLoading(
          false,
        );
      }
    };

    loadComments();
  }, [currentPost._id]);

  const handleLike = async () => {
    if (isLikeLoading) {
      return;
    }

    try {
      setIsLikeLoading(true);
      setLikesError("");

      const data =
        await toggleLike(
          currentPost._id,
        );

      setIsLiked(
        data.liked,
      );

      setLikesCount(
        data.likesCount,
      );
    } catch (error) {
      setLikesError(
        error instanceof Error
          ? error.message
          : "Failed to update like.",
      );
    } finally {
      setIsLikeLoading(
        false,
      );
    }
  };

  const handleCommentLike = async (
    commentId: string,
  ) => {
    if (
      commentLikeLoadingId ===
      commentId
    ) {
      return;
    }

    try {
      setCommentLikeLoadingId(
        commentId,
      );

      setCommentsError("");

      const data =
        await toggleCommentLike(
          commentId,
        );

      setCommentLikes(
        (previous) => ({
          ...previous,
          [commentId]: {
            liked:
              data.liked,
            likesCount:
              data.likesCount,
          },
        }),
      );
    } catch (error) {
      setCommentsError(
        error instanceof Error
          ? error.message
          : "Failed to update comment like.",
      );
    } finally {
      setCommentLikeLoadingId(
        null,
      );
    }
  };

  const handleCommentSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const trimmedText =
        commentText.trim();

      if (
        trimmedText === "" ||
        isCommentSubmitting
      ) {
        return;
      }

      try {
        setIsCommentSubmitting(
          true,
        );

        setCommentsError("");

        const newComment =
          await createComment(
            currentPost._id,
            trimmedText,
          );

        setComments(
          (previousComments) => [
            newComment,
            ...previousComments,
          ],
        );

        setCommentsCount(
          (previousCount) =>
            previousCount + 1,
        );

        setCommentLikes(
          (previous) => ({
            ...previous,
            [newComment._id]: {
              liked: false,
              likesCount: 0,
            },
          }),
        );

        setCommentText("");
      } catch (error) {
        setCommentsError(
          error instanceof Error
            ? error.message
            : "Failed to create comment.",
        );
      } finally {
        setIsCommentSubmitting(
          false,
        );
      }
    };

  const handleDeleteComment =
    async (commentId: string) => {
      if (deletingCommentId) {
        return;
      }

      try {
        setDeletingCommentId(
          commentId,
        );

        setCommentsError("");

        await deleteComment(
          commentId,
        );

        setComments(
          (previousComments) =>
            previousComments.filter(
              (comment) =>
                comment._id !==
                commentId,
            ),
        );

        setCommentLikes(
          (previous) => {
            const updated = {
              ...previous,
            };

            delete updated[
              commentId
            ];

            return updated;
          },
        );

        setCommentsCount(
          (previousCount) =>
            Math.max(
              0,
              previousCount - 1,
            ),
        );
      } catch (error) {
        setCommentsError(
          error instanceof Error
            ? error.message
            : "Failed to delete comment.",
        );
      } finally {
        setDeletingCommentId(
          null,
        );
      }
    };

  const formatPostDate = (
    dateString: string,
  ) => {
    const date = new Date(
      dateString,
    );

    const now = new Date();

    const diffInSeconds =
      Math.floor(
        (now.getTime() -
          date.getTime()) /
          1000,
      );

    if (diffInSeconds < 60) {
      return `${Math.max(
        0,
        diffInSeconds,
      )} s`;
    }

    const diffInMinutes =
      Math.floor(
        diffInSeconds / 60,
      );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} m`;
    }

    const diffInHours =
      Math.floor(
        diffInMinutes / 60,
      );

    if (diffInHours < 24) {
      return `${diffInHours} h`;
    }

    const diffInDays =
      Math.floor(
        diffInHours / 24,
      );

    if (diffInDays < 7) {
      return `${diffInDays} d`;
    }

    const diffInWeeks =
      Math.floor(
        diffInDays / 7,
      );

    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${
        diffInWeeks === 1
          ? ""
          : "s"
      }`;
    }

    const diffInMonths =
      Math.floor(
        diffInDays / 30,
      );

    if (diffInMonths < 12) {
      return `${diffInMonths} month${
        diffInMonths === 1
          ? ""
          : "s"
      }`;
    }

    const diffInYears =
      Math.floor(
        diffInDays / 365,
      );

    return `${diffInYears} year${
      diffInYears === 1
        ? ""
        : "s"
    }`;
  };

  const postParagraphs =
    currentPost.description
      .split(/\n\s*\n/)
      .filter(
        (paragraph) =>
          paragraph.trim() !== "",
      );

  return (
    <div className={cls.container}>
      <div
        className={cls.left}
        style={{
          backgroundImage: `url(${currentPost.image})`,
        }}
      >
        <div className={cls.teaser}>
          {currentPost.description}
        </div>
      </div>

      <div className={cls.right}>
        <PostHeader
          post={currentPost}
          isOwnPost={isOwnPost}
          onMenuClick={onMenuClick}
          onClose={onClose}
          isFollowing={isFollowing}
          isFollowLoading={
            isFollowLoading
          }
          handleFollow={
            handleFollow
          }
        />

        {followError && (
          <p className={cls.followError}>
            {followError}
          </p>
        )}

        <PostDescription
          post={currentPost}
          postParagraphs={
            postParagraphs
          }
          formatPostDate={
            formatPostDate
          }
          onClose={onClose}
        />

        <PostComments
          comments={comments}
          commentsCount={
            commentsCount
          }
          commentText={commentText}
          setCommentText={
            setCommentText
          }
          isCommentsLoading={
            isCommentsLoading
          }
          isCommentSubmitting={
            isCommentSubmitting
          }
          commentsError={
            commentsError
          }
          deletingCommentId={
            deletingCommentId
          }
          commentLikes={
            commentLikes
          }
          commentLikeLoadingId={
            commentLikeLoadingId
          }
          currentUserId={
            currentUser?._id
          }
          handleCommentLike={
            handleCommentLike
          }
          handleCommentSubmit={
            handleCommentSubmit
          }
          handleDeleteComment={
            handleDeleteComment
          }
          isLiked={isLiked}
          likesCount={
            likesCount
          }
          isLikeLoading={
            isLikeLoading
          }
          likesError={
            likesError
          }
          handleLike={
            handleLike
          }
          formatPostDate={
            formatPostDate
          }
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default PostView;