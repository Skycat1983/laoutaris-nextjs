import mongoose, { Document } from "mongoose";

export interface BaseUser {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

export interface UserDB extends BaseUser, Document {
  comments: mongoose.Schema.Types.ObjectId[];
  watchlist: mongoose.Schema.Types.ObjectId[];
  favourites: mongoose.Schema.Types.ObjectId[];
}

// Create the user schema
const userSchema = new mongoose.Schema<UserDB>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  },
  { timestamps: true }
);

// Create the User model using the discriminator
export const UserModel =
  mongoose.models.User || mongoose.model<UserDB>("User", userSchema);
