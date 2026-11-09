import { Request, Response } from "express";
import mongoose from "mongoose";

import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Follow } from "../models/Follow.js";

// Получить все посты конкретного пользователя
export const getUserPosts = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const posts = await Post.find({
      author: userId,
    })
      .select("-image")
      .populate(
        "author",
        "_id username fullName",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get user posts error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Создать пост
export const createPost = async (
  req: Request,
  res: Response,
) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64",
    )}`;

    const post = await Post.create({
      description,
      image,
      author: req.userId,
    });

    const populatedPost = await post.populate(
      "author",
      "_id username fullName image",
    );

    return res.status(201).json({
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Удалить пост
export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Получить конкретный пост
export const getPostById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id).populate(
      "author",
      "_id username fullName image",
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Обновить пост
export const updatePost = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    if (
      description === undefined &&
      !req.file
    ) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    if (description !== undefined) {
      post.description = description;
    }

    if (req.file) {
      post.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64",
      )}`;
    }

    await post.save();

    const updatedPost = await post.populate(
      "author",
      "_id username fullName image",
    );

    return res.status(200).json({
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Получить все посты
export const getAllPosts = async (
  req: Request,
  res: Response,
) => {
  try {
    const posts = await Post.find()
      .select("-image")
      .populate(
        "author",
        "_id username fullName",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Получить отдельно картинку от поста
export const getPostImage = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id).select(
      "image",
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const match = post.image.match(
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
      "Get post image error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Получить посты пользователей,
// на которых подписан текущий пользователь
export const getFeedPosts = async (
  req: Request,
  res: Response,
) => {
  try {
    const following = await Follow.find({
      follower: req.userId,
    }).select("following");

    const followingIds =
      following.map(
        (follow) => follow.following,
      );

    const posts = await Post.find({
      author: {
        $in: followingIds,
      },
    })
      .select("-image")
      .populate(
        "author",
        "_id username fullName image",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(
      "Get feed posts error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};