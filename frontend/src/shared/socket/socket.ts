import { io } from "socket.io-client";

import { refresh } from "../api/auth";

const SOCKET_URL =
  import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

let refreshPromise: Promise<void> | null =
  null;

let isSocketDisconnecting = false;

const refreshAccessToken =
  async (): Promise<void> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = refresh()
      .then(() => {})
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

export const connectSocket =
  (): void => {
    isSocketDisconnecting = false;

    if (socket.connected) {
      return;
    }

    if (socket.active) {
      return;
    }

    socket.connect();
  };

export const disconnectSocket =
  (): void => {
    isSocketDisconnecting = true;

    socket.disconnect();
  };

socket.on("connect", () => {});

socket.on(
  "disconnect",
  (reason) => {}
);

socket.on(
  "connect_error",
  async (error) => {
    if (
      error.message !==
      "Unauthorized"
    ) {
      return;
    }

    if (isSocketDisconnecting) {
      return;
    }

    try {
      await refreshAccessToken();

      if (isSocketDisconnecting) {
        return;
      }

      if (!socket.connected) {
        socket.connect();
      }
    } catch (refreshError) {}
  }
);