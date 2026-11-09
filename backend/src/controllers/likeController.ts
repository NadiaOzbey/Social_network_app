import {
  Request,
  Response,
} from "express";

import { Like } from "../models/Like.js";
import { Post } from "../models/Post.js";
import {
  Notification,
  type PopulatedNotification,
} from "../models/Notification.js";

import {
  emitNotification,
} from "../socket/notificationSocket.js";

// ПОЛУЧЕНИЕ СПИСКА ЛАЙКОВ ПОД ПОСТОМ
export const getPostLikes = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const { postId } = req.params;

    const likes =
      await Like.find({
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
      likes,
      likesCount: likes.length,
    });
  } catch (error) {
    console.error(
      "Get post likes error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ПРОСТАВЛЕНИЕ / УДАЛЕНИЕ ЛАЙКОВ
export const toggleLike = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = // смотрим, лайкали ли мы уже этот пост
      await Like.findOne({
        user: userId,
        post: postId,
      });

    if (existingLike) { // если лайкали -- убираем лайк
      await Like.findByIdAndDelete(
        existingLike._id
      );

      const likesCount =
        await Like.countDocuments({
          post: postId,
        });

      return res.status(200).json({
        liked: false,
        likesCount,
      });
    }

    await Like.create({ // если не лайкали -- лайкаем
      user: userId,
      post: postId,
    });

    if (
      post.author.toString() !== userId // если пользователь сам себя лайкнул, уведомление ему не отправляем
    ) {
      const notification =
        await Notification.create({
          recipient: post.author,
          actor: userId,
          type: "like",
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

    const likesCount =
      await Like.countDocuments({
        post: postId,
      });

    return res.status(200).json({
      liked: true,
      likesCount,
    });
  } catch (error) {
    console.error(
      "Toggle like error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};