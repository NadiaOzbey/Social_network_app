import { Link } from "react-router-dom";

import type { Post } from "../../model/types";

import cls from "./ExplorePostCard.module.scss";

type ExplorePostCardProps = {
  post: Post;
};

const ExplorePostCard = ({
  post,
}: ExplorePostCardProps) => {
  const API_URL =
    import.meta.env.VITE_API_URL;

  const postImageUrl =
    `${API_URL}/api/posts/${post._id}/image`;

  return (
    <Link
      to={`/post/${post._id}`}
      className={cls.card}
    >
      <img
        src={postImageUrl}
        alt=""
        loading="lazy"
      />
    </Link>
  );
};

export default ExplorePostCard;