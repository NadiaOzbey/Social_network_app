import {
  type MouseEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import type { Post } from "../../../model/types";

import cls from "./PostDescription.module.scss";

import ringlet2 from "../../../../../shared/assets/ringlet2.svg";

type PostDescriptionProps = {
  post: Post;
  postParagraphs: string[];
  formatPostDate: (
    dateString: string,
  ) => string;
  onClose?: () => void;
};

const PostDescription = ({
  post,
  postParagraphs,
  formatPostDate,
}: PostDescriptionProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(
      `/profile/${post.author._id}`,
    );
  };

  return (
    <div className={cls.descriptionSection}>
      <div className={cls.left}>
        <Link
          className={cls.avatarLink}
          to={`/profile/${post.author._id}`}
          onClick={handleProfileClick}
          aria-label={`Open ${post.author.username}'s profile`}
        >
          <div className={cls.avatar}>
            <img
              className={cls.avatarImage}
              src={post.author.image}
              alt={`avatar of ${post.author.username}`}
            />

            <img
              className={cls.avatarBorder}
              src={ringlet2}
              alt=""
            />
          </div>
        </Link>
      </div>

      <div className={cls.right}>
        <div className={cls.usernameAndText}>
          <Link
            className={cls.username}
            to={`/profile/${post.author._id}`}
            onClick={handleProfileClick}
          >
            {post.author.username}
          </Link>

          <div className={cls.description}>
            {postParagraphs.map(
              (paragraph, index) => (
                <p
                  key={`${post._id}-${index}`}
                >
                  {paragraph}
                </p>
              ),
            )}
          </div>
        </div>

        <p className={cls.timeStamp}>
          {formatPostDate(
            post.createdAt,
          )}
        </p>
      </div>
    </div>
  );
};

export default PostDescription;