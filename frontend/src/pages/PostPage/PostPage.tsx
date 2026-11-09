import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  Post,
} from "../../entities/Post/model/types";

import PostModal from "../../entities/Post/ui/PostModal/PostModal";

import {
  getPostById,
} from "../../shared/api/posts";

import {
  useAppSelector,
} from "../../app/store/hooks";

import { PageLoader } from "../../shared/ui/PageLoader/PageLoader";

const PostPage = () => {
  const {
    postId,
  } = useParams<{
    postId: string;
  }>();

  const navigate = useNavigate();

  const {
    currentUser,
    isLoading: isAuthLoading,
  } = useAppSelector(
    (state) => state.user,
  );

  const [post, setPost] =
    useState<Post | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!postId) {
      setError(
        "Post ID is missing.",
      );

      setIsLoading(false);

      return;
    }

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getPostById(postId);

        setPost(data);
      } catch (error) {
        console.error(
          "Failed to load post:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load post.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handlePostUpdated = (
    updatedPost: Post,
  ) => {
    setPost(updatedPost);
  };

  const handlePostDeleted = (
    deletedPostId: string,
  ) => {
    if (
      !post ||
      post._id !== deletedPostId
    ) {
      return;
    }

    navigate(
      `/profile/${post.author._id}`,
      {
        replace: true,
      },
    );
  };

  if (
    isAuthLoading ||
    isLoading
  ) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <p>
        {error}
      </p>
    );
  }

  if (!post) {
    return (
      <p>
        Post not found.
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p>
        User is not authenticated.
      </p>
    );
  }

  return (
    <PostModal
      post={post}
      onClose={() =>
        navigate(-1)
      }
      onPostDeleted={
        handlePostDeleted
      }
      onPostUpdated={
        handlePostUpdated
      }
    />
  );
};

export default PostPage;