import type { Post } from "../../model/types";

import ExplorePostCard from "../ExplorePostCard/ExplorePostCard";

import cls from "./ExplorePostGrid.module.scss";

type ExplorePostGridProps = {
  posts: Post[];
};

const ExplorePostGrid = ({
  posts,
}: ExplorePostGridProps) => {
  return (
    <div className={cls.container}>
      {posts.map((post) => (
        <ExplorePostCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  );
};

export default ExplorePostGrid;