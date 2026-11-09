// Храним активную рефреш-сессию пользователя: 

import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshSession extends Document {
  userId: Types.ObjectId;
  jti: string;
  expiresAt: Date;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jti: {    // уникальный ID конкретного рефреш-токена
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB автоматически удалит сессию после expiresAt (TTL-индекс)
refreshSessionSchema.index(
  { expiresAt: 1 }, // создай индекс по полю expiresAt
  { expireAfterSeconds: 0 } // когда наступит время expiresAt, можешь удалить этот документ
);

export const RefreshSession = mongoose.model<IRefreshSession>(  // встроенный метод для создания mongoose-модели
  "RefreshSession",
  refreshSessionSchema
);