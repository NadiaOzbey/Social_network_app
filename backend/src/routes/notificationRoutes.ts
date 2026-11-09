import { Router } from "express";

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationAsRead
);

export default router;