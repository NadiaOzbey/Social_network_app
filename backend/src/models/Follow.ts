import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export interface IFollow
  extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
}

const followSchema =
  new Schema<IFollow>(
    {
      follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

// Один пользователь не может
// подписаться на одного и того же
// пользователя несколько раз.
followSchema.index(
  {
    follower: 1,
    following: 1,
  },
  {
    unique: true,
  }
);

export const Follow =
  mongoose.model<IFollow>(
    "Follow",
    followSchema
  );
