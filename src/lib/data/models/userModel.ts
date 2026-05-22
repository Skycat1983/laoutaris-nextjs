import mongoose, { Document } from "mongoose";
import {
  ACCOUNT_ACKNOWLEDGEMENT_ACCEPTED_BY,
  ACCOUNT_ACKNOWLEDGEMENT_PROVIDERS,
  ACCOUNT_ACKNOWLEDGEMENT_SOURCE_SURFACES,
  type AccountPrivacyAcknowledgement,
  USER_ROLES,
  UserRole,
} from "@/lib/constants";
export interface UserBase {
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  accountPrivacyAcknowledgement?: AccountPrivacyAcknowledgement;
}

export interface UserDB extends UserBase, Document {
  comments: mongoose.Schema.Types.ObjectId[];
  watchlist: mongoose.Schema.Types.ObjectId[];
  favourites: mongoose.Schema.Types.ObjectId[];
}

// Create the user schema
const accountPrivacyAcknowledgementSchema =
  new mongoose.Schema<AccountPrivacyAcknowledgement>(
    {
      privacyVersion: { type: String, required: true },
      termsVersion: { type: String, required: true },
      acceptedAt: { type: Date, required: true },
      acceptedBy: {
        type: String,
        enum: ACCOUNT_ACKNOWLEDGEMENT_ACCEPTED_BY,
        required: true,
      },
      provider: {
        type: String,
        enum: ACCOUNT_ACKNOWLEDGEMENT_PROVIDERS,
        required: true,
      },
      sourceSurface: {
        type: String,
        enum: ACCOUNT_ACKNOWLEDGEMENT_SOURCE_SURFACES,
        required: true,
      },
    },
    { _id: false }
  );

const userSchema = new mongoose.Schema<UserDB>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: USER_ROLES, default: "user" },
    accountPrivacyAcknowledgement: {
      type: accountPrivacyAcknowledgementSchema,
      required: false,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  },
  { timestamps: true }
);

// Create the User model using the discriminator
export const UserModel =
  mongoose.models.User || mongoose.model<UserDB>("User", userSchema);
