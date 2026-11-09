import { Router } from "express";

import {
  getProfile,
  getCurrentUser,
  updateProfile,
  searchUsers,
  getUserImage,
} from "../controllers/userController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

import {
  upload,
  processImage,
} from "../middleware/uploadMiddleware.js";

const router = Router();

// Поиск пользователей
router.get(
  "/search",
  searchUsers,
);

// Получить текущего пользователя
router.get(
  "/me",
  authMiddleware,
  getCurrentUser,
);

// Получить изображение пользователя
router.get(
  "/:userId/image",
  getUserImage,
);

// Получить профиль пользователя
router.get(
  "/:userId",
  getProfile,
);

// Обновить профиль
router.patch(
  "/profile",
  authMiddleware,
  upload.single("image"),
  processImage,
  updateProfile,
);

export default router;