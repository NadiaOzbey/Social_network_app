import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import {
  ACCESS_COOKIE,
} from "../utils/cookies.js";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

let io: Server | null = null;

const getCookieValue = (
  cookieHeader: string,
  cookieName: string
): string | undefined => {
  const cookies =
    cookieHeader.split(";");

  const cookie = cookies.find(
    (item) => {
      const [name] =
        item.trim().split("=");

      return name === cookieName;
    }
  );

  if (!cookie) {
    return undefined;
  }

  const [, value] =
    cookie.trim().split("=");

  return value;
};

export const initializeSocket = (
  httpServer: HttpServer
) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader =
        socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(
          new Error("Unauthorized")
        );
      }

      const accessToken =
        getCookieValue(
          cookieHeader,
          ACCESS_COOKIE
        );

      if (!accessToken) {
        return next(
          new Error("Unauthorized")
        );
      }

      const payload =
        verifyAccessToken(
          accessToken
        );

      socket.data.userId =
        payload.id;

      next();
    } catch (error) {
      next(
        new Error("Unauthorized")
      );
    }
  });

  io.on("connection", (socket) => {
    const userId =
      socket.data.userId as string;

    const roomName =
      `user:${userId}`;

    socket.join(roomName);

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};