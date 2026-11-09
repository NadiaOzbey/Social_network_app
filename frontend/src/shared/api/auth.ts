import type { User } from "../../entities/User/model/types";

const API_URL = import.meta.env.VITE_API_URL;

type AuthResponse = {
  message: string;
  user: User;
};

type MessageResponse = {
  message: string;
};

type RegisterData = {
  email: string;
  fullName: string;
  username: string;
  password: string;
};

type LoginData = {
  usernameOrEmail: string;
  password: string;
};

type RequestPasswordResetData = {
  identifier: string;
};

type ResetPasswordData = {
  token: string;
  password: string;
};

export const register = async (
  data: RegisterData,
): Promise<User> => {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result: AuthResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to register",
    );
  }

  return result.user;
};

export const login = async (
  data: LoginData,
): Promise<User> => {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  const result: AuthResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to login",
    );
  }

  return result.user;
};

export const refresh = async (): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  const result: MessageResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to refresh token",
    );
  }
};

export const logout = async (): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  const result: MessageResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to logout",
    );
  }
};

export const requestPasswordReset =
  async (
    data: RequestPasswordResetData,
  ): Promise<string> => {
    const response = await fetch(
      `${API_URL}/api/auth/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result: MessageResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to request password reset",
      );
    }

    return result.message;
  };

export const resetPassword = async (
  data: ResetPasswordData,
): Promise<string> => {
  const response = await fetch(
    `${API_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result: MessageResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to reset password",
    );
  }

  return result.message;
};