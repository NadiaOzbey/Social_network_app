import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export interface IComment
  extends Document {
  text: string;
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema =
  new Schema<IComment>(
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },

      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const Comment =
  mongoose.model<IComment>(
    "Comment",
    commentSchema
  );