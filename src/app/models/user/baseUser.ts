import mongoose, { Document } from "mongoose";

// Define the interface for the base user
export interface IBaseUser extends Document {
  email: string;
  username: string;
  password: string;
}

// Define the base options for the schema
const baseOptions = {
  discriminatorKey: "userRole", // Key to differentiate between user types
  collection: "users", // Collection name in MongoDB
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
};

// Create the base user schema
const baseUserSchema = new mongoose.Schema<IBaseUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Password cannot be 'select: false'
  },
  baseOptions
);

// Create the base user model
const BaseUserModel =
  mongoose.models.BaseUser ||
  mongoose.model<IBaseUser>("BaseUser", baseUserSchema);

export { BaseUserModel };
