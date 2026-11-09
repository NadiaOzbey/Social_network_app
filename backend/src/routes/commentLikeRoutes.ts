import { Router } from "express";

import {
  getCommentLikes,
  toggleCommentLike,
} from "../controllers/commentLikeController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/:commentId/likes",
  authMiddleware,
  getCommentLikes,
);

router.post(
  "/:commentId/like",
  authMiddleware,
  toggleCommentLike,
);

export default router;