import {
  Request,
  Response,
} from "express";

import { Follow } from "../models/Follow.js";
import { User } from "../models/User.js";
import {
  Notification,
  type PopulatedNotification,
} from "../models/Notification.js";

import {
  emitNotification,
} from "../socket/notificationSocket.js";

// Get followers
export const getFollowers = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const followers =
      await Follow.find({
        following: userId,
      })
        .populate(
          "follower",
          "_id username fullName image"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      followers,
    });
  } catch (error) {
    console.error(
      "Get followers error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Get following
export const getFollowing = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const following =
      await Follow.find({
        follower: userId,
      })
        .populate(
          "following",
          "_id username fullName image"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      following,
    });
  } catch (error) {
    console.error(
      "Get following error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Follow user
export const followUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const followerId = req.userId;
    const { userId: followingId } =
      req.params;

    if (!followerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (
      followerId === followingId
    ) {
      return res.status(400).json({
        message:
          "You cannot follow yourself",
      });
    }

    const user =
      await User.findById(followingId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingFollow =
      await Follow.findOne({
        follower: followerId,
        following: followingId,
      });

    if (existingFollow) {
      return res.status(400).json({
        message:
          "You are already following this user",
      });
    }

    const follow =
      await Follow.create({
        follower: followerId,
        following: followingId,
      });

    const notification =
      await Notification.create({
        recipient: followingId,
        actor: followerId,
        type: "follow",
      });

    const populatedNotification =
      (await notification.populate(
        "actor",
        "_id username image"
      )) as unknown as PopulatedNotification;

    emitNotification(
      followingId,
      populatedNotification
    );

    return res.status(201).json({
      message:
        "User followed successfully",
      follow,
    });
  } catch (error) {
    console.error(
      "Follow user error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Unfollow user
export const unfollowUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const followerId = req.userId;
    const { userId: followingId } =
      req.params;

    if (!followerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const follow =
      await Follow.findOneAndDelete({
        follower: followerId,
        following: followingId,
      });

    if (!follow) {
      return res.status(404).json({
        message:
          "Follow relationship not found",
      });
    }

    return res.status(200).json({
      message:
        "User unfollowed successfully",
    });
  } catch (error) {
    console.error(
      "Unfollow user error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};