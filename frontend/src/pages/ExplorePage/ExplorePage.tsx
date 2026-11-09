import {
  useEffect,
  useState,
} from "react";

import type {
  Post,
} from "../../entities/Post/model/types";

import ExplorePostGrid from "../../entities/Post/ui/ExplorePostGrid/ExplorePostGrid";

import {
  getAllPosts,
} from "../../shared/api/posts";

import { PageLoader } from "../../shared/ui/PageLoader/PageLoader";

import cls from "./ExplorePage.module.scss";

const shufflePosts = (
  posts: Post[],
): Post[] => {
  const shuffled = [...posts];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [
      shuffled[i],
      shuffled[j],
    ] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
};

const ExplorePage = () => {
  const [posts, setPosts] =
    useState<Post[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getAllPosts();

        setPosts(
          shufflePosts(data),
        );
      } catch (error) {
        console.error(
          "Failed to load explore posts:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load posts.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={cls.explorePage}>
      <ExplorePostGrid
        posts={posts}
      />
    </div>
  );
};

export default ExplorePage;