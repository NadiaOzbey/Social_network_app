import type { Post } from "../../model/types";

import ProfilePost from "../ProfilePost/ProfilePost";

import cls from "./ProfilePostGrid.module.scss";

type ProfilePostGridProps = {
  posts: Post[];
  onPostClick: (post: Post) => void;
};

const ProfilePostGrid = ({
  posts,
  onPostClick,
}: ProfilePostGridProps) => {
  return (
    <div className={cls.container}>
      {posts.map((post) => (
        <ProfilePost
          key={post._id}
          post={post}
          onClick={onPostClick}
        />
      ))}
    </div>
  );
};

export default ProfilePostGrid;