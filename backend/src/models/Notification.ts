import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export type NotificationType =
  | "like"
  | "comment"
  | "follow";

export interface INotification
  extends Document {
  recipient: Types.ObjectId;
  actor: Types.ObjectId;
  type: NotificationType;
  post?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PopulatedNotification =
  Omit<
    INotification,
    "actor" | "post"
  > & {
    actor: {
      _id: Types.ObjectId;
      username: string;
      image: string;
    };
    post?: {
      _id: Types.ObjectId;
      image: string;
    };
  };

const notificationSchema =
  new Schema<INotification>(
    {
      recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      actor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "like",
          "comment",
          "follow",
        ],
        required: true,
      },

      post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },

      read: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

export const Notification =
  mongoose.model<INotification>(
    "Notification",
    notificationSchema
  );