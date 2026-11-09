import { Router } from "express";

import {
  getAllPosts,
  getFeedPosts,
  getUserPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostImage,
} from "../controllers/postController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

import {
  upload,
  processImage,
} from "../middleware/uploadMiddleware.js";

const router = Router();

// Получить все посты
router.get(
  "/",
  getAllPosts,
);

// Получить ленту постов подписок
router.get(
  "/feed",
  authMiddleware,
  getFeedPosts,
);

// Получить отдельно картинки постов
router.get(
  "/:id/image",
  getPostImage,
);

// Получить все посты конкретного пользователя
router.get(
  "/user/:userId",
  getUserPosts,
);

// Получить конкретный пост
router.get(
  "/:id",
  getPostById,
);

// Создать пост
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  processImage,
  createPost,
);

// Обновить пост
router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  processImage,
  updatePost,
);

// Удалить пост
router.delete(
  "/:id",
  authMiddleware,
  deletePost,
);

export default router;