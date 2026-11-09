import type { Post } from "../../model/types";

import cls from "./ProfilePost.module.scss";

type ProfilePostProps = {
  post: Post;
  onClick: (post: Post) => void;
};

const ProfilePost = ({
  post,
  onClick,
}: ProfilePostProps) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const postImageUrl =
    `${API_URL}/api/posts/${post._id}/image`;

  return (
    <div
      className={cls.post}
      style={{
        backgroundImage: `url(${postImageUrl})`,
      }}
      onClick={() => onClick(post)}
    >
      <div className={cls.description}>
        {post.description}
      </div>
    </div>
  );
};

export default ProfilePost;