import mongoose from "mongoose";
import { UserDB, UserModel } from "./userModel";

// Define the interface for the Admin user
export interface IAdmin extends UserDB {
  biography: string;
  blogEntries: mongoose.Schema.Types.ObjectId[];
  role: "admin";
}

// Create the admin schema
const adminSchema = new mongoose.Schema<IAdmin>({
  biography: { type: String, required: true },
  blogEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
  role: { type: String, enum: ["admin"], default: "admin" },
});

// Create the Admin model using the discriminator
export const AdminModel =
  UserModel.discriminators?.["Admin"] ||
  UserModel.discriminator<IAdmin>("Admin", adminSchema);
