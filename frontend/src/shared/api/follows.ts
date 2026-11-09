import { apiFetch } from "./apiFetch";

const API_URL = import.meta.env.VITE_API_URL;

export type FollowUser = {
  _id: string;
  username: string;
  fullName: string;
  image: string;
};

type FollowerResponseItem = {
  _id: string;
  follower: FollowUser;
  following: string;
  createdAt: string;
  updatedAt: string;
};

type FollowingResponseItem = {
  _id: string;
  follower: string;
  following: FollowUser;
  createdAt: string;
  updatedAt: string;
};

type FollowersResponse = {
  followers: FollowerResponseItem[];
};

type FollowingResponse = {
  following: FollowingResponseItem[];
};

type FollowResponse = {
  follow: {
    _id: string;
    follower: string;
    following: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Получить подписчиков пользователя
// Публичный маршрут: GET /api/follows/:userId/followers
export const getFollowers = async (
  userId: string,
): Promise<FollowUser[]> => {
  const response = await fetch(
    `${API_URL}/api/follows/${userId}/followers`,
  );

  const data: FollowersResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      (data as unknown as { message?: string })
        .message || "Failed to fetch followers",
    );
  }

  return data.followers.map(
    (follow) => follow.follower,
  );
};

// Получить подписки пользователя
// Публичный маршрут: GET /api/follows/:userId/following
export const getFollowing = async (
  userId: string,
): Promise<FollowUser[]> => {
  const response = await fetch(
    `${API_URL}/api/follows/${userId}/following`,
  );

  const data: FollowingResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      (data as unknown as { message?: string })
        .message || "Failed to fetch following",
    );
  }

  return data.following.map(
    (follow) => follow.following,
  );
};

// Подписаться на пользователя
// Защищённый маршрут: POST /api/follows/:userId
export const followUser = async (
  userId: string,
): Promise<FollowResponse["follow"]> => {
  const response = await apiFetch(
    `${API_URL}/api/follows/${userId}`,
    {
      method: "POST",
    },
  );

  const data: FollowResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      (data as unknown as { message?: string })
        .message || "Failed to follow user",
    );
  }

  return data.follow;
};

// Отписаться от пользователя
// Защищённый маршрут: DELETE /api/follows/:userId
export const unfollowUser = async (
  userId: string,
): Promise<void> => {
  const response = await apiFetch(
    `${API_URL}/api/follows/${userId}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to unfollow user",
    );
  }
};