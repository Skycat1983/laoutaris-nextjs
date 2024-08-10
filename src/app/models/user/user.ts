import mongoose from "mongoose";
import { BaseUserModel, IBaseUser } from "./baseUser";
import { IAdmin } from "./admin";

// Define the interface for a regular User
export interface IUser extends IBaseUser {
  role: "user";
  watchlist: mongoose.Schema.Types.ObjectId[];
}

type UserTypes = IUser | IAdmin;

// Create the user schema
const userSchema = new mongoose.Schema<IUser>(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
  },
  { timestamps: true }
);

// Pre-save hook for user validation
userSchema.pre<UserTypes>("save", async function (next) {
  const user = this;
  let validationErrors: Array<any> = [];

  console.log(
    "IF YOU ARE SEEING THIS YOU DIDN'T ADDRESS THE PRE-SAVE VALIDATION LOGIC! DO IT!"
  );

  //   if (user.isNew || user.isModified("email")) {
  //     const existingUserByEmail = await UserModel.findOne({ email: user.email });
  //     if (existingUserByEmail) {
  //       validationErrors.push({
  //         msg: "Email already exists",
  //         path: "email",
  //         value: user.email,
  //         location: "body",
  //       });
  //     }
  //   }

  //   if (user.isNew || user.isModified("username")) {
  //     const existingUserByUsername = await UserModel.findOne({
  //       username: user.username,
  //     });
  //     if (existingUserByUsername) {
  //       validationErrors.push({
  //         msg: "Username already exists",
  //         path: "username",
  //         value: user.username,
  //         location: "body",
  //       });
  //     }
  //   }

  //   if (validationErrors.length) {
  //     const error = new Error("Validation failed");
  //     return next(error);
  //   }
  next();
});

// Create the User model using the discriminator
const UserModel =
  BaseUserModel.discriminators?.["User"] ||
  BaseUserModel.discriminator<IUser>("User", userSchema);

export { UserModel };
