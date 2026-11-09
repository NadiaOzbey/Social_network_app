import { apiFetch } from "./apiFetch";

const API_URL = import.meta.env.VITE_API_URL;

export type LikeUser = {
  _id: string;
  username: string;
  image: string;
};

export type PostLike = {
  _id: string;
  user: LikeUser;
  post: string;
  createdAt: string;
  updatedAt: string;
};

export type PostLikesResponse = {
  likes: PostLike[];
  likesCount: number;
};

export type ToggleLikeResponse = {
  liked: boolean;
  likesCount: number;
};

// Получить все лайки поста
// Публичный маршрут: GET /api/likes/:postId
export const getPostLikes = async (
  postId: string,
): Promise<PostLikesResponse> => {
  const response = await fetch(
    `${API_URL}/api/likes/${postId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch post likes",
    );
  }

  return data;
};

// Добавить или убрать лайк
// Защищённый маршрут: POST /api/likes/:postId
export const toggleLike = async (
  postId: string,
): Promise<ToggleLikeResponse> => {
  const response = await apiFetch(
    `${API_URL}/api/likes/${postId}`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to toggle like",
    );
  }

  return data;
};