import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import type {
  Post,
} from "../../entities/Post/model/types";

import FeedPostList from "../../entities/Post/ui/FeedPostList/FeedPostList";

import {
  getFeedPosts,
} from "../../shared/api/posts";

import {
  PageLoader,
} from "../../shared/ui/PageLoader/PageLoader";

import cls from "./MainPage.module.scss";

import check_mark from "../../shared/assets/check_mark.svg";

const MainPage = () => {
  const location = useLocation();

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);

        const data =
          await getFeedPosts();

        setPosts(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [
    location.state?.refreshPosts,
  ]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className={cls.mainPage}>
      <div className={cls.posts}>
        <FeedPostList
          posts={posts}
        />
      </div>

      <div className={cls.check}>
        <img
          src={check_mark}
          alt=""
        />

        <p className={cls.bold}>
          You've seen all the updates
        </p>

        <p className={cls.plain}>
          You have seen all new publications
        </p>
      </div>
    </div>
  );
};

export default MainPage;