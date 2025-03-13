import mongoose, { Document } from "mongoose";

export interface CommentBase {
  text: string;
  displayDate: Date;
}

export interface CommentDB extends Document, CommentBase {
  author: mongoose.Schema.Types.ObjectId;
  blog: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
