import { UserModel } from "@/lib/data/models";
import { verifyPassword } from "@/lib/helpers/bcrypt";
import dbConnect from "@/lib/db/mongodb";
import { RequestInternal } from "next-auth";
import { validateLoginData } from "../validation/validateLoginData";
import type { UserRole } from "@/lib/constants";

interface LoginWithUsernameFormData {
  username: string;
  password: string;
}

interface AuthenticateUserSuccess {
  success: true;
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
    role: UserRole;
  };
}

interface AuthenticateUserError {
  success: false;
  error: string;
}

type AuthenticateUserResponse = AuthenticateUserSuccess | AuthenticateUserError;

export const authenticateUsername = async ({
  username,
  password,
}: LoginWithUsernameFormData): Promise<AuthenticateUserResponse> => {
  const existingUser = await UserModel.findOne({ username: username });
  if (!existingUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const { password: hashedPassword } = existingUser;
  if (typeof hashedPassword !== "string" || hashedPassword.length === 0) {
    return {
      success: false,
      error: "Invalid password",
    };
  }

  const verified = await verifyPassword(password, hashedPassword);

  if (!verified) {
    return {
      success: false,
      error: "Invalid password",
    };
  }

  return {
    success: true,
    message: "User logged in successfully",
    user: {
      _id: existingUser._id.toString(),
      email: existingUser.email,
      username: existingUser.username,
      role: existingUser.role ?? "user",
    },
  };
};

export const authorizeUser = async (
  credentials: Record<"username" | "password", string> | undefined,
  req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
) => {
  // Connect to the database
  await dbConnect();

  // Extract username and password from the credentials
  const usernameData = credentials?.username as unknown;
  const passwordData = credentials?.password as unknown;

  const validatedData = validateLoginData({ usernameData, passwordData });

  if (!validatedData.success) {
    // data validation failed
    return null;
  }

  const { username, password } = validatedData;

  const result = await authenticateUsername({ username, password });
  //? changed to return username as 'name' for consistency with github signin session
  if (result.success) {
    return {
      id: result.user._id,
      email: result.user.email,
      name: result.user.username,
      role: result.user.role,
    };
  }

  return null;
};
