import mongoose, { Document } from "mongoose";
import { USER_ROLES, UserRole } from "@/lib/constants";
export interface UserBase {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UserDB extends UserBase, Document {
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
    role: { type: String, enum: USER_ROLES, default: "user" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  },
  { timestamps: true }
);

// Create the User model using the discriminator
export const UserModel =
  mongoose.models.User || mongoose.model<UserDB>("User", userSchema);
