import {
  Request,
  Response,
} from "express";

import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import {
  Notification,
  type PopulatedNotification,
} from "../models/Notification.js";

import {
  emitNotification,
} from "../socket/notificationSocket.js";

// Get post comments
export const getPostComments = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const { postId } = req.params;

    const comments =
      await Comment.find({
        post: postId,
      })
        .populate(
          "user",
          "_id username image"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      comments,
      commentsCount:
        comments.length,
    });
  } catch (error) {
    console.error(
      "Get post comments error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Create comment
export const createComment = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        message:
          "Comment text is required",
      });
    }

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment =
      await Comment.create({
        text: text.trim(),
        user: userId,
        post: postId,
      });

    const populatedComment =
      await comment.populate(
        "user",
        "_id username image"
      );

    if (
      post.author.toString() !== userId
    ) {
      const notification =
        await Notification.create({
          recipient: post.author,
          actor: userId,
          type: "comment",
          post: post._id,
        });

      const populatedNotification =
        (await notification.populate([
          {
            path: "actor",
            select:
              "_id username image",
          },
          {
            path: "post",
            select: "_id image",
          },
        ])) as unknown as PopulatedNotification;

      emitNotification(
        post.author.toString(),
        populatedNotification
      );
    }

    return res.status(201).json({
      comment: populatedComment,
    });
  } catch (error) {
    console.error(
      "Create comment error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete comment
export const deleteComment = async (
  req: Request<{ commentId: string }>,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const comment =
      await Comment.findById(
        commentId
      );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !== userId
    ) {
      return res.status(403).json({
        message:
          "You can delete only your own comment",
      });
    }

    await Comment.findByIdAndDelete(
      commentId
    );

    return res.status(200).json({
      message:
        "Comment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete comment error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
