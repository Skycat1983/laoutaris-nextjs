import mongoose, { Document } from "mongoose";

export interface BaseComment {
  text: string;
  displayDate: Date;
}

export interface DBComment extends Document, BaseComment {
  author: mongoose.Schema.Types.ObjectId;
  blog: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<DBComment>(
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
  mongoose.model<DBComment>("Comment", commentSchema);

export { CommentModel };
