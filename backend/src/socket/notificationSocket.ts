import {
  getIO,
} from "./socket.js";

import type {
  PopulatedNotification,
} from "../models/Notification.js";

export const emitNotification = (
  recipientId: string,
  notification: PopulatedNotification
) => {
  getIO() // получаем экземпляр socket.io-сервера: "дай мне доступ к socket.io, чтобы я мог отправить сообщение"
    .to(`user:${recipientId}`) // всем соединениям, которые находятся в комнате ${recipientId}
    .emit( // теперь отправляй
      "notification",
      notification
    );
};
