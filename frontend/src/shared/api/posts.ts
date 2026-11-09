import { apiFetch } from "./apiFetch";

import type {
  Post,
  CreatePostData,
  UpdatePostData,
} from "../../entities/Post/model/types";

const API_URL = import.meta.env.VITE_API_URL;

// Получить все посты
// Публичный маршрут: GET /api/posts
export const getAllPosts = async (): Promise<Post[]> => {
  const response = await fetch(
    `${API_URL}/api/posts`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch posts",
    );
  }

  return data.posts;
};

// Получить посты пользователей,
// на которых подписан текущий пользователь
// Защищённый маршрут: GET /api/posts/feed
export const getFeedPosts = async (): Promise<
  Post[]
> => {
  const response = await apiFetch(
    `${API_URL}/api/posts/feed`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch feed posts",
    );
  }

  return data.posts;
};

// Получить все посты конкретного пользователя
// Публичный маршрут: GET /api/posts/user/:userId
export const getUserPosts = async (
  userId: string,
): Promise<Post[]> => {
  const response = await fetch(
    `${API_URL}/api/posts/user/${userId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch user posts",
    );
  }

  return data.posts;
};

// Создать пост
// Защищённый маршрут: POST /api/posts
export const createPost = async (
  postData: CreatePostData,
): Promise<Post> => {
  const formData = new FormData();

  formData.append(
    "description",
    postData.description,
  );

  formData.append(
    "image",
    postData.image,
  );

  const response = await apiFetch(
    `${API_URL}/api/posts`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create post",
    );
  }

  return data.post;
};

// Получить конкретный пост
// Публичный маршрут: GET /api/posts/:postId
export const getPostById = async (
  postId: string,
): Promise<Post> => {
  const response = await fetch(
    `${API_URL}/api/posts/${postId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch post",
    );
  }

  return data.post;
};

// Обновить пост
// Защищённый маршрут: PATCH /api/posts/:postId
export const updatePost = async (
  postId: string,
  postData: UpdatePostData,
): Promise<Post> => {
  const formData = new FormData();

  if (
    postData.description !== undefined
  ) {
    formData.append(
      "description",
      postData.description,
    );
  }

  if (postData.image !== undefined) {
    formData.append(
      "image",
      postData.image,
    );
  }

  const response = await apiFetch(
    `${API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update post",
    );
  }

  return data.post;
};

// Удалить пост
// Защищённый маршрут: DELETE /api/posts/:postId
export const deletePost = async (
  postId: string,
): Promise<void> => {
  const response = await apiFetch(
    `${API_URL}/api/posts/${postId}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete post",
    );
  }
};