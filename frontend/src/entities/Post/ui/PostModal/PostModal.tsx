import {
  useEffect,
  useState,
} from "react";

import type { Post } from "../../model/types";

import PostView from "../PostView/PostView";
import PostActionsModal from "../PostActionsModal/PostActionsModal";
import EditPostModal from "../EditPostModal/EditPostModal";

import { useAppSelector } from "../../../../app/store/hooks";

import cls from "./PostModal.module.scss";

type PostModalProps = {
  post: Post;
  onClose: () => void;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (updatedPost: Post) => void;
};

const PostModal = ({
  post,
  onClose,
  onPostDeleted,
  onPostUpdated,
}: PostModalProps) => {
  const { currentUser } = useAppSelector(
    (state) => state.user,
  );

  const [currentPost, setCurrentPost] =
    useState<Post>(post);

  const [isActionsModalOpen, setIsActionsModalOpen] =
    useState(false);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const isOwnPost =
    currentUser?._id === currentPost.author._id;

  const handleEdit = () => {
    setIsActionsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handlePostUpdated = (
    updatedPost: Post,
  ) => {
    setCurrentPost(updatedPost);
    setIsEditModalOpen(false);

    onPostUpdated(updatedPost);
  };

  return (
    <div
      className={cls.overlay}
      onClick={onClose}
    >
      <div
        className={cls.modal}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <PostView
          post={currentPost}
          isOwnPost={isOwnPost}
          onMenuClick={() =>
            setIsActionsModalOpen(true)
          }
          onClose={onClose}
        />
      </div>

      {isActionsModalOpen && (
        <PostActionsModal
          post={currentPost}
          onClose={() =>
            setIsActionsModalOpen(false)
          }
          onEdit={handleEdit}
          onPostDeleted={onPostDeleted}
        />
      )}

      {isEditModalOpen && (
        <EditPostModal
          post={currentPost}
          onClose={() =>
            setIsEditModalOpen(false)
          }
          onPostUpdated={
            handlePostUpdated
          }
        />
      )}
    </div>
  );
};

export default PostModal;