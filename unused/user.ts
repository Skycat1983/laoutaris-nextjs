import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "userRole",
  collection: "users",
  timestamps: true,
};

const baseUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, //! this cannot be 'select: false' because we need to compare it with the password entered by the user
  },
  baseOptions
);

// export const BaseUserModel = mongoose.model("BaseUser", baseUserSchema);

const BaseUserModel =
  mongoose.models.BaseUser || mongoose.model("BaseUser", baseUserSchema);

export { BaseUserModel };

const adminSchema = new mongoose.Schema({
  biography: { type: String, required: true },
  blogEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
  role: { type: String, enum: ["admin"], default: "admin" },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, //! this cannot be 'select: false' because we need to compare it with the password entered by the user
    role: { type: String, enum: ["user", "admin"], default: "user" },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "artwork" }],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const user = this;
  let validationErrors = [];

  if (user.isNew || user.isModified("email")) {
    const existingUserByEmail = await UserModel.findOne({ email: user.email });
    if (existingUserByEmail) {
      validationErrors.push({
        msg: "Email already exists",
        path: "email",
        value: user.email,
        location: "body",
      });
    }
  }

  if (user.isNew || user.isModified("username")) {
    const existingUserByUsername = await UserModel.findOne({
      username: user.username,
    });
    if (existingUserByUsername) {
      validationErrors.push({
        msg: "Username already exists",
        path: "username",
        value: user.username,
        location: "body",
      });
    }
  }

  if (validationErrors.length) {
    const error = new Error("Validation failed");
    // error.statusCode = 400;
    // error.errors = validationErrors;
    return next(error);
  }

  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export { UserModel };

//? Lean Queries: Use .lean() with populate to retrieve plain JavaScript objects instead of Mongoose documents. This reduces processing time because Mongoose skips instantiating full model instances.
// Projection: Use projection to limit the fields returned by the query. This can significantly reduce the workload on MongoDB and the amount of data transferred.
// export const UserModel = mongoose.model("user", userSchema);
