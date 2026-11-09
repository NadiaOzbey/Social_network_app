import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import { connectDB } from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import commentLikeRoutes from "./routes/commentLikeRoutes.js";

const app = express();

const httpServer = createServer(app);

initializeSocket(httpServer);

const PORT =
  process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/likes",
  likeRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/follows",
  followRoutes
);

app.use(
  "/api/comments",
  commentLikeRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );
  }
};

startServer();