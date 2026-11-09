import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import EmojiPicker, {
  type EmojiClickData,
} from "emoji-picker-react";

import {
  useAppSelector,
} from "../../../app/store/hooks";

import {
  createPost,
} from "../../../shared/api/posts";

import cls from "./CreatePost.module.scss";

import upload from "../../../shared/assets/upload.svg";
import smiley from "../../../shared/assets/smiley.svg";

const MAX_DESCRIPTION_LENGTH = 2200;

const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } =
    useAppSelector(
      (state) => state.user,
    );

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [
    previewImage,
    setPreviewImage,
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    isEmojiPickerOpen,
    setIsEmojiPickerOpen,
  ] = useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const backgroundLocation =
    location.state?.backgroundLocation;

  const handleClose = () => {
    navigate(-1);
  };

  const handleOverlayClick = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file.",
      );

      return;
    }

    setError("");
    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPreviewImage(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(
          previewImage,
        );
      }
    };
  }, [previewImage]);

  const handleEmojiClick = (
    emojiData: EmojiClickData,
  ) => {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const cursorStart =
      textarea.selectionStart;

    const cursorEnd =
      textarea.selectionEnd;

    const newDescription =
      description.slice(
        0,
        cursorStart,
      ) +
      emojiData.emoji +
      description.slice(
        cursorEnd,
      );

    if (
      newDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      return;
    }

    setDescription(
      newDescription,
    );

    setIsEmojiPickerOpen(false);

    requestAnimationFrame(() => {
      textarea.focus();

      const newCursorPosition =
        cursorStart +
        emojiData.emoji.length;

      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition,
      );
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!currentUser) {
      setError(
        "User is not authenticated.",
      );

      return;
    }

    if (!image) {
      setError(
        "Please select an image.",
      );

      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await createPost({
        description,
        image,
      });

      navigate(
        backgroundLocation || "/",
        {
          state: {
            refreshPosts: Date.now(),
          },
        },
      );
    } catch (error) {
      console.error(
        "Failed to create post:",
        error,
      );

      setError(
        "Failed to create post.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const userImageUrl =
    `${API_URL}/api/users/${currentUser._id}/image`;

  return (
    <div
      className={cls.overlay}
      onClick={
        handleOverlayClick
      }
    >
      <div
        className={cls.modal}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <form
          onSubmit={handleSubmit}
        >
          <div
            className={cls.header}
          >
            <h2>
              Create new post
            </h2>

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Sharing..."
                : "Share"}
            </button>
          </div>

          <div
            className={cls.content}
          >
            <div
              className={
                cls.imageSection
              }
            >
              <input
                id="create-post-image"
                className={
                  cls.fileInput
                }
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                disabled={isLoading}
              />

              {!previewImage && (
                <label
                  className={
                    cls.uploadArea
                  }
                  htmlFor="create-post-image"
                >
                  <span
                    className={
                      cls.uploadIcon
                    }
                  >
                    <img
                      src={upload}
                      alt=""
                    />
                  </span>
                </label>
              )}

              {previewImage && (
                <div
                  className={
                    cls.previewWrapper
                  }
                >
                  <img
                    className={
                      cls.previewImage
                    }
                    src={previewImage}
                    alt="Post preview"
                  />

                  <label
                    className={
                      cls.changeImage
                    }
                    htmlFor="create-post-image"
                  >
                    Change image
                  </label>
                </div>
              )}
            </div>

            <div
              className={cls.right}
            >
              <div
                className={cls.user}
              >
                <img
                  className={
                    cls.avatar
                  }
                  src={userImageUrl}
                  alt={
                    currentUser.username
                  }
                />

                <p>
                  {
                    currentUser.username
                  }
                </p>
              </div>

              <div
                className={
                  cls.description
                }
              >
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
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
                    className={
                      cls.emojiButton
                    }
                    type="button"
                    onClick={() =>
                      setIsEmojiPickerOpen(
                        (prev) =>
                          !prev,
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
                    {
                      description.length
                    }{" "}
                    /{" "}
                    {
                      MAX_DESCRIPTION_LENGTH
                    }
                  </span>
                </div>

                {isEmojiPickerOpen && (
                  <div
                    className={
                      cls.emojiPicker
                    }
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
};

export default CreatePost;