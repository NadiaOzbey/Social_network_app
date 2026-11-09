import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.post("/reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;