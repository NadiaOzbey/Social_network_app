import { useState } from "react";

import type { Post } from "../../model/types";

import { useNavigate } from "react-router-dom";

import { deletePost } from "../../../../shared/api/posts";

import cls from "./PostActionsModal.module.scss";

type PostActionsModalProps = {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
  onPostDeleted: (postId: string) => void;
};

const PostActionsModal = ({
  post,
  onClose,
  onEdit,
  onPostDeleted,
}: PostActionsModalProps) => {
  const navigate = useNavigate();

  const [
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    isLinkCopied,
    setIsLinkCopied,
  ] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await deletePost(post._id);

      onPostDeleted(post._id);
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error,
      );

      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteConfirmOpen(false);
  };

  const handleGoToPost = () => {
    onClose();

    navigate(
      `/post/${post._id}`,
    );
  };

  const handleCopyLink = async () => {
    try {
      const postUrl =
        `${window.location.origin}/post/${post._id}`;

      await navigator.clipboard.writeText(
        postUrl,
      );

      setIsLinkCopied(true);

      setTimeout(() => {
        setIsLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy post link:",
        error,
      );
    }
  };

  return (
    <div
      className={cls.overlay}
      onClick={onClose}
    >
      <div
        className={`${cls.modal} ${
          isDeleteConfirmOpen
            ? cls.confirmModal
            : ""
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {!isDeleteConfirmOpen ? (
          <>
            <button
              type="button"
              className={`${cls.actionButton} ${cls.delete}`}
              onClick={
                handleDeleteClick
              }
            >
              Delete
            </button>

            <button
              type="button"
              className={cls.actionButton}
              onClick={onEdit}
            >
              Edit
            </button>

            <button
              type="button"
              className={cls.actionButton}
              onClick={
                handleGoToPost
              }
            >
              Go to post
            </button>

            <button
              type="button"
              className={cls.actionButton}
              onClick={
                handleCopyLink
              }
            >
              Copy link
            </button>

            <button
              type="button"
              className={cls.actionButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        ) : (
          <div className={cls.confirmContent}>
            <p className={cls.confirmText}>
              Are you sure you want to
              delete this post?
            </p>

            <button
              type="button"
              className={`${cls.confirmButton} ${cls.confirmDelete}`}
              onClick={
                handleDeleteConfirm
              }
              disabled={isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </button>

            <button
              type="button"
              className={cls.confirmButton}
              onClick={
                handleDeleteCancel
              }
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {isLinkCopied && (
        <div className={cls.toast}>
          Link copied!
        </div>
      )}
    </div>
  );
};

export default PostActionsModal;