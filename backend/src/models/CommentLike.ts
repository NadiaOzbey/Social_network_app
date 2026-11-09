import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export interface ICommentLike extends Document {
  comment: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentLikeSchema =
  new Schema<ICommentLike>(
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },

      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

commentLikeSchema.index(
  { comment: 1, user: 1 },
  { unique: true }
);

export const CommentLike =
  mongoose.model<ICommentLike>(
    "CommentLike",
    commentLikeSchema
  );