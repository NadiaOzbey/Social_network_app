import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import EmojiPicker, {
  type EmojiClickData,
} from "emoji-picker-react";

import type { Post } from "../../model/types";

import { useAppSelector } from "../../../../app/store/hooks";

import { updatePost } from "../../../../shared/api/posts";

import cls from "./EditPostModal.module.scss";

import upload from "../../../../shared/assets/upload.svg";
import smiley from "../../../../shared/assets/smiley.svg";

const MAX_DESCRIPTION_LENGTH = 2200;

type EditPostModalProps = {
  post: Post;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
};

const EditPostModal = ({
  post,
  onClose,
  onPostUpdated,
}: EditPostModalProps) => {
  const { currentUser } = useAppSelector(
    (state) => state.user,
  );

  const [description, setDescription] = useState(
    post.description,
  );

  const [image, setImage] =
    useState<File | null>(null);

  const [previewImage, setPreviewImage] =
    useState<string | null>(post.image);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] =
    useState(false);

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    onClose();
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    setError("");
    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setPreviewImage(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleEmojiClick = (
    emojiData: EmojiClickData,
  ) => {
    const textarea =
      document.querySelector<HTMLTextAreaElement>(
        `.${cls.description} textarea`,
      );

    if (!textarea) {
      return;
    }

    const cursorStart =
      textarea.selectionStart;

    const cursorEnd =
      textarea.selectionEnd;

    const newDescription =
      description.slice(0, cursorStart) +
      emojiData.emoji +
      description.slice(cursorEnd);

    if (
      newDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      return;
    }

    setDescription(newDescription);

    setIsEmojiPickerOpen(false);

    requestAnimationFrame(() => {
      textarea.focus();

      const newCursorPosition =
        cursorStart + emojiData.emoji.length;

      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition,
      );
    });
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!currentUser) {
      setError("User is not authenticated.");

      return;
    }

    if (description.trim() === "") {
      setError(
        "Post description cannot be empty.",
      );

      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const updatedPost = await updatePost(
        post._id,
        {
          description,
          image: image ?? undefined,
        },
      );

      onPostUpdated(updatedPost);
    } catch (error) {
      console.error(
        "Failed to update post:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update post.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const modal = (
    <div
      className={cls.overlay}
      onClick={handleOverlayClick}
    >
      <div
        className={cls.modal}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <form onSubmit={handleSubmit}>
          <div className={cls.header}>
            <h2>Edit post</h2>

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>

          <div className={cls.content}>
            <div className={cls.imageSection}>
              <input
                id="edit-post-image"
                className={cls.fileInput}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />

              {!previewImage && (
                <label
                  className={cls.uploadArea}
                  htmlFor="edit-post-image"
                >
                  <span className={cls.uploadIcon}>
                    <img
                      src={upload}
                      alt=""
                    />
                  </span>
                </label>
              )}

              {previewImage && (
                <div
                  className={cls.previewWrapper}
                >
                  <img
                    className={cls.previewImage}
                    src={previewImage}
                    alt="Post preview"
                  />

                  <label
                    className={cls.changeImage}
                    htmlFor="edit-post-image"
                  >
                    Change image
                  </label>
                </div>
              )}
            </div>

            <div className={cls.right}>
              <div className={cls.user}>
                <img
                  className={cls.avatar}
                  src={post.author.image}
                  alt={post.author.username}
                />

                <p>
                  {post.author.username}
                </p>
              </div>

              <div className={cls.description}>
                <textarea
                  value={description}
                  onChange={
                    handleDescriptionChange
                  }
                  maxLength={
                    MAX_DESCRIPTION_LENGTH
                  }
                  disabled={isLoading}
                />

                <div
                  className={
                    cls.descriptionFooter
                  }
                >
                  <button
                    className={cls.emojiButton}
                    type="button"
                    onClick={() =>
                      setIsEmojiPickerOpen(
                        (previous) => !previous,
                      )
                    }
                    disabled={isLoading}
                    aria-label="Add emoji"
                  >
                    <img
                      src={smiley}
                      alt=""
                    />
                  </button>

                  <span>
                    {description.length} /{" "}
                    {MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>

                {isEmojiPickerOpen && (
                  <div
                    className={cls.emojiPicker}
                  >
                    <EmojiPicker
                      onEmojiClick={
                        handleEmojiClick
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className={cls.error}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );

  return createPortal(
    modal,
    document.body,
  );
};

export default EditPostModal;