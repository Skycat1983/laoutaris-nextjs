import mongoose, { Document } from "mongoose";

export interface DBComment extends Document {
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
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
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  mongoose.models.Comment ||
  mongoose.model<DBComment>("Comment", commentSchema);

export { CommentModel };
