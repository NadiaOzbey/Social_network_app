import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  username: string;
  password: string;
  bio?: string;
  image?: string;
  externalLink?: {
    title: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    externalLink: {
      title: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);