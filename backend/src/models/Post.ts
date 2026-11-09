import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export interface IPost extends Document {
  description: string;
  image: string;
  author: Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({
  author: 1,
  createdAt: -1,
});

export const Post = mongoose.model<IPost>(
  "Post",
  postSchema,
);