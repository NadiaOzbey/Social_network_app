import { Router } from "express";

import {
  createComment,
  getPostComments,
  deleteComment,
} from "../controllers/commentController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

const router = Router();

// Получить все комментарии поста
router.get(
  "/:postId",
  getPostComments
);

// Добавить комментарий
router.post(
  "/:postId",
  authMiddleware,
  createComment
);

// Удалить свой комментарий
router.delete(
  "/:commentId",
  authMiddleware,
  deleteComment
);

export default router;