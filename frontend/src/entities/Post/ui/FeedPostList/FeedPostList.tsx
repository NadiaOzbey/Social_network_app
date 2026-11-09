import { useEffect, useState } from "react";

import type { Post } from "../../model/types";

import FeedPost from "../FeedPost/FeedPost";

import cls from "./FeedPostList.module.scss";

type FeedPostListProps = {
  posts: Post[];
};

const FeedPostList = ({
  posts: initialPosts,
}: FeedPostListProps) => {
  const [posts, setPosts] =
    useState(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handlePostDeleted = (
    postId: string,
  ) => {
    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post._id !== postId,
      ),
    );
  };

  const handlePostUpdated = (
    updatedPost: Post,
  ) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id
          ? updatedPost
          : post,
      ),
    );
  };

  return (
    <div className={cls.container}>
      {posts.map((post) => (
        <FeedPost
          key={post._id}
          post={post}
          onPostDeleted={
            handlePostDeleted
          }
          onPostUpdated={
            handlePostUpdated
          }
        />
      ))}
    </div>
  );
};

export default FeedPostList;