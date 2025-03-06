import mongoose, { Document } from "mongoose";

export interface BaseUser {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

export interface DBUser extends BaseUser, Document {
  comments: mongoose.Schema.Types.ObjectId[];
  watchlist: mongoose.Schema.Types.ObjectId[];
  favourites: mongoose.Schema.Types.ObjectId[];
}

export type LeanUser = Omit<DBUser, keyof Document> & {
  _id: string;
  comments: string[];
  watchlist: string[];
  favourites: string[];
};

// Create the user schema
const userSchema = new mongoose.Schema<DBUser>(
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
  mongoose.models.User || mongoose.model<DBUser>("User", userSchema);

//! with descriminator
// export interface IUser extends IBaseUser {

//   role: "user";
//   watchlist: mongoose.Schema.Types.ObjectId[];
// }

// type UserTypes = IUser | IAdmin;

// // Create the user schema
// const userSchema = new mongoose.Schema<IUser>(
//   {
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//     watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
//   },
//   { timestamps: true }
// );

// // Pre-save hook for user validation
// userSchema.pre<UserTypes>("save", async function (next) {
//   const user = this;
//   let validationErrors: Array<any> = [];

//   console.log(
//     "IF YOU ARE SEEING THIS YOU DIDN'T ADDRESS THE PRE-SAVE VALIDATION LOGIC! DO IT!"
//   );

//   //   if (user.isNew || user.isModified("email")) {
//   //     const existingUserByEmail = await UserModel.findOne({ email: user.email });
//   //     if (existingUserByEmail) {
//   //       validationErrors.push({
//   //         msg: "Email already exists",
//   //         path: "email",
//   //         value: user.email,
//   //         location: "body",
//   //       });
//   //     }
//   //   }

//   //   if (user.isNew || user.isModified("username")) {
//   //     const existingUserByUsername = await UserModel.findOne({
//   //       username: user.username,
//   //     });
//   //     if (existingUserByUsername) {
//   //       validationErrors.push({
//   //         msg: "Username already exists",
//   //         path: "username",
//   //         value: user.username,
//   //         location: "body",
//   //       });
//   //     }
//   //   }

//   //   if (validationErrors.length) {
//   //     const error = new Error("Validation failed");
//   //     return next(error);
//   //   }
//   next();
// });

// // Create the User model using the discriminator
// const UserModel =
//   BaseUserModel.discriminators?.["User"] ||
//   BaseUserModel.discriminator<IUser>("User", userSchema);

// export { UserModel };
