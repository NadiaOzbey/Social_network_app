import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { ACCESS_COOKIE } from "../utils/cookies.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[ACCESS_COOKIE];

    if (!token) {
      return res.status(401).json({
        message: "No access token provided",
      });
    }

    const decoded = verifyAccessToken(token);

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};