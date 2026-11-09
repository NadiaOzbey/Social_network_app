import { Router } from "express";

import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../controllers/followController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

const router = Router();

// Получить подписчиков пользователя
router.get(
  "/:userId/followers",
  getFollowers
);

// Получить подписки пользователя
router.get(
  "/:userId/following",
  getFollowing
);

// Подписаться на пользователя
router.post(
  "/:userId",
  authMiddleware,
  followUser
);

// Отписаться от пользователя
router.delete(
  "/:userId",
  authMiddleware,
  unfollowUser
);

export default router;
