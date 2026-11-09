import {
  Router,
} from "express";

import {
  toggleLike,
  getPostLikes,  
} from "../controllers/likeController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

const router = Router();

// Добавить или убрать лайк
router.post(
  "/:postId",
  authMiddleware,
  toggleLike
);

// Получить все лайки поста
router.get(
  "/:postId",
  getPostLikes
);

export default router;