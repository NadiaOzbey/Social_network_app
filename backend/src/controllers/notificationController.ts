import { Request, Response } from "express";

import {
  Notification,
} from "../models/Notification.js";

// Получить уведомления
export const getNotifications = async (
  req: Request,
  res: Response,
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.userId,
      })
        .populate(
          "actor",
          "_id username image",
        )
        .populate(
          "post",
          "_id image",
        )
        .sort({
          createdAt: -1,
        });

    const unreadCount =
      notifications.filter(
        (notification) =>
          !notification.read,
      ).length;

    return res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error,
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Отметить уведомление как прочитанное
export const markNotificationAsRead =
  async (
    req: Request<{
      notificationId: string;
    }>,
    res: Response,
  ) => {
    try {
      const {
        notificationId,
      } = req.params;

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: notificationId,
            recipient: req.userId,
          },
          {
            read: true,
          },
          {
            new: true,
          },
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error,
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  };