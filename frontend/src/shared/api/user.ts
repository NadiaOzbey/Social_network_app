import { apiFetch } from "./apiFetch";
import type { User } from "../../entities/User/model/types";

const API_URL = import.meta.env.VITE_API_URL;

export const getProfile = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/users/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data.user;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiFetch(`${API_URL}/api/users/me`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data.user;
};

type UpdateProfileData = {
  username?: string;
  fullName?: string;
  bio?: string;
  image?: File;
  externalLink?: {
    title: string;
    url: string;
  };
};

export const updateProfile = async (
  profileData: UpdateProfileData,
): Promise<User> => {
  const formData = new FormData();

  if (profileData.username !== undefined) {
    formData.append("username", profileData.username);
  }

  if (profileData.fullName !== undefined) {
    formData.append("fullName", profileData.fullName);
  }

  if (profileData.bio !== undefined) {
    formData.append("bio", profileData.bio);
  }

  if (profileData.image !== undefined) {
    formData.append("image", profileData.image);
  }

  if (profileData.externalLink !== undefined) {
    formData.append(
      "externalLink",
      JSON.stringify(profileData.externalLink),
    );
  }

  const response = await apiFetch(`${API_URL}/api/users/profile`, {
    method: "PATCH",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.user;
};

export type SearchUser = {
  _id: string;
  username: string;
  fullName: string;
};

export const searchUsers = async (
  query: string,
): Promise<SearchUser[]> => {
  const response = await fetch(
    `${API_URL}/api/users/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return data.users;
};

export const getUserImageUrl = (userId: string): string => {
  return `${API_URL}/api/users/${userId}/image`;
};