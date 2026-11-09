import { apiFetch } from "./apiFetch";

const API_URL = import.meta.env.VITE_API_URL;

export type CommentUser = {
  _id: string;
  username: string;
  image: string;
};

export type PostComment = {
  _id: string;
  text: string;
  user: CommentUser;
  post: string;
  createdAt: string;
  updatedAt: string;
};

export type PostCommentsResponse = {
  comments: PostComment[];
  commentsCount: number;
};

export type CommentLikesResponse = {
  likesCount: number;
  liked: boolean;
};

// Получить комментарии поста
// Публичный маршрут: GET /api/comments/:postId
export const getPostComments = async (
  postId: string,
): Promise<PostCommentsResponse> => {
  const response = await fetch(
    `${API_URL}/api/comments/${postId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch post comments",
    );
  }

  return data;
};

// Создать комментарий
// Защищённый маршрут: POST /api/comments/:postId
export const createComment = async (
  postId: string,
  text: string,
): Promise<PostComment> => {
  const response = await apiFetch(
    `${API_URL}/api/comments/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create comment",
    );
  }

  return data.comment;
};

// Удалить комментарий
// Защищённый маршрут: DELETE /api/comments/:commentId
export const deleteComment = async (
  commentId: string,
): Promise<void> => {
  const response = await apiFetch(
    `${API_URL}/api/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete comment",
    );
  }
};

// Получить лайки комментария
// Защищённый маршрут: GET /api/comments/:commentId/likes
export const getCommentLikes = async (
  commentId: string,
): Promise<CommentLikesResponse> => {
  const response = await apiFetch(
    `${API_URL}/api/comments/${commentId}/likes`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch comment likes",
    );
  }

  return data;
};

// Поставить/убрать лайк с комментария
// Защищённый маршрут: POST /api/comments/:commentId/like
export const toggleCommentLike = async (
  commentId: string,
): Promise<CommentLikesResponse> => {
  const response = await apiFetch(
    `${API_URL}/api/comments/${commentId}/like`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update comment like",
    );
  }

  return data;
};