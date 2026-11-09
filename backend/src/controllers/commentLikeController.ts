import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";

export const getCommentLikes = async (
  req: Request,
  res: Response,
) => {
  try {
    const { commentId } = req.params;

    if (typeof commentId !== "string") {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const currentUserId = req.userId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const likesCount = await CommentLike.countDocuments({
      comment: commentId,
    });

    let liked = false;

    if (currentUserId) {
      const existingLike = await CommentLike.findOne({
        comment: commentId,
        user: currentUserId,
      });

      liked = Boolean(existingLike);
    }

    return res.status(200).json({
      likesCount,
      liked,
    });
  } catch (error) {
    console.error(
      "Failed to get comment likes:",
      error,
    );

    return res.status(500).json({
      message: "Failed to get comment likes",
    });
  }
};

export const toggleCommentLike = async (
  req: Request,
  res: Response,
) => {
  try {
    const { commentId } = req.params;

    if (typeof commentId !== "string") {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const currentUserId = req.userId;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const existingLike = await CommentLike.findOne({
      comment: commentId,
      user: currentUserId,
    });

    let liked: boolean;

    if (existingLike) {
      await CommentLike.findByIdAndDelete(
        existingLike._id,
      );

      liked = false;
    } else {
      await CommentLike.create({
        comment: commentId,
        user: currentUserId,
      });

      liked = true;
    }

    const likesCount =
      await CommentLike.countDocuments({
        comment: commentId,
      });

    return res.status(200).json({
      liked,
      likesCount,
    });
  } catch (error) {
    console.error(
      "Failed to toggle comment like:",
      error,
    );

    return res.status(500).json({
      message: "Failed to update comment like",
    });
  }
};