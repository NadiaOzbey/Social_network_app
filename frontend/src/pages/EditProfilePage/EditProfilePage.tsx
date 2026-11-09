import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/store/hooks";

import {
  setUser,
} from "../../entities/User/model/userSlice";

import {
  updateProfile,
  getUserImageUrl,
} from "../../shared/api/user";

import cls from "./EditProfilePage.module.scss";

import link from "../../shared/assets/link.svg";

const MAX_BIO_LENGTH = 1000;

const EditProfilePage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    currentUser,
    isLoading,
  } = useAppSelector(
    (state) => state.user,
  );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [linkTitle, setLinkTitle] =
    useState("");

  const [linkUrl, setLinkUrl] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState<File | undefined>(
      undefined,
    );

  const [previewImage, setPreviewImage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setUsername(
      currentUser.username,
    );

    setBio(currentUser.bio);

    setLinkTitle(
      currentUser.externalLink?.title ??
        "",
    );

    setLinkUrl(
      currentUser.externalLink?.url ??
        "",
    );

    setPreviewImage(
      getUserImageUrl(
        currentUser._id,
      ),
    );
  }, [currentUser]);

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

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPreviewImage(previewUrl);
  };

  const handleNewPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const updatedUser =
        await updateProfile({
          username,
          bio,
          image: selectedImage,
          externalLink: {
            title: linkTitle,
            url: linkUrl,
          },
        });

      dispatch(
        setUser(updatedUser),
      );

      navigate(
        `/profile/${updatedUser._id}`,
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error,
      );

      if (
        error instanceof Error &&
        error.message ===
          "Username already taken"
      ) {
        setError(
          "Username already taken",
        );

        return;
      }

      setError(
        "Failed to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <p>
        Loading profile...
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
    <div className={cls.container}>
      <h1>Edit profile</h1>

      <div className={cls.header}>
        <img
          src={previewImage}
          alt={currentUser.username}
        />

        <div className={cls.middle}>
          <h3>
            {currentUser.username}
          </h3>

          <p>
            {currentUser.bio}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewPhoto}
          disabled={isSaving}
        >
          New photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className={cls.field}>
          <label htmlFor="username">
            Username
          </label>

          <input
            className={cls.username}
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value,
              )
            }
          />
        </div>

        <div className={cls.field}>
          <label htmlFor="linkTitle">
            Website
          </label>

          <div className={cls.website}>
            <img
              src={link}
              alt=""
            />

            <input
              id="linkTitle"
              type="text"
              value={linkTitle}
              onChange={(event) =>
                setLinkTitle(
                  event.target.value,
                )
              }
            />
          </div>
        </div>

        <div className={cls.field}>
          <label htmlFor="about">
            About
          </label>

          <div
            className={
              cls.textareaWrapper
            }
          >
            <textarea
              id="about"
              value={bio}
              onChange={(event) =>
                setBio(
                  event.target.value,
                )
              }
              maxLength={
                MAX_BIO_LENGTH
              }
            />

            <span
              className={
                cls.characterCounter
              }
            >
              {bio.length}/
              {MAX_BIO_LENGTH}
            </span>
          </div>
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;