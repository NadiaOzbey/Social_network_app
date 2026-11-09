import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import { User } from "../models/User.js";

export const getProfile = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId,
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user =
      await User.findById(userId).select(
        "-password -image",
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const user =
      await User.findById(
        req.userId,
      ).select("-password -image");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
) => {
  try {
    const user =
      await User.findById(
        req.userId,
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      username,
      fullName,
      bio,
      externalLink,
    } = req.body;

    if (
      username !== undefined
    ) {
      user.username = username;
    }

    if (
      fullName !== undefined
    ) {
      user.fullName = fullName;
    }

    if (
      bio !== undefined
    ) {
      user.bio = bio;
    }

    if (
      externalLink !== undefined
    ) {
      try {
        user.externalLink =
          typeof externalLink ===
          "string"
            ? JSON.parse(
                externalLink,
              )
            : externalLink;
      } catch {
        return res.status(400).json({
          message:
            "Invalid external link data",
        });
      }
    }

    if (req.file) {
      user.image =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64",
        )}`;
    }

    await user.save();

    const updatedUser =
      await User.findById(
        user._id,
      ).select("-password -image");

    return res.status(200).json({
      message:
        "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
) => {
  try {
    const query =
      typeof req.query.query ===
      "string"
        ? req.query.query.trim()
        : "";

    if (!query) {
      return res.status(200).json({
        users: [],
      });
    }

    const users =
      await User.find({
        $or: [
          {
            username: {
              $regex: query,
              $options: "i",
            },
          },
          {
            fullName: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      }).select(
        "_id username fullName",
      );

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Search users error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Получить отдельно картинку пользователя
export const getUserImage = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId,
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user =
      await User.findById(userId).select(
        "image",
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.image) {
      return res.status(404).json({
        message: "User image not found",
      });
    }

    const match = user.image.match(
      /^data:(.+);base64,(.+)$/,
    );

    if (!match) {
      return res.status(500).json({
        message: "Invalid image data",
      });
    }

    const mimeType = match[1];
    const base64Data = match[2];

    const imageBuffer = Buffer.from(
      base64Data,
      "base64",
    );

    res.set(
      "Content-Type",
      mimeType,
    );

    res.set(
      "Cache-Control",
      "public, max-age=3600",
    );

    return res.send(imageBuffer);
  } catch (error) {
    console.error(
      "Get user image error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};