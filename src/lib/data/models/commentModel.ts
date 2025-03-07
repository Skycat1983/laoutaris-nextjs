import mongoose, { Document } from "mongoose";

export interface BaseComment {
  text: string;
  displayDate: Date;
}

export interface CommentDB extends Document, BaseComment {
  author: mongoose.Schema.Types.ObjectId;
  blog: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeanComment = Omit<CommentDB, keyof Document> & {
  _id: string;
  author: string;
  blog: string;
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new mongoose.Schema<CommentDB>(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    displayDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  mongoose.models.Comment ||
  mongoose.model<CommentDB>("Comment", commentSchema);

export { CommentModel };
