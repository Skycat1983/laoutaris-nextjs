import { UserModel } from "@/lib/data/models";
import { verifyPassword } from "@/lib/shared/helpers/bcrypt";
import { LoginFormData, LoginWithUsernameFormData } from "./processLogin";
import dbConnect from "@/lib/db/mongodb";
import { RequestInternal } from "next-auth";
import { validateLoginData } from "../validation/validateLoginData";

interface AuthenticateUserSuccess {
  success: true;
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
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
  console.log("existingUser :>> ", existingUser);
  if (!existingUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const { password: hashedPassword } = existingUser;
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
      _id: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
    },
  };
};

export const authenticateUser = async ({
  email,
  password,
}: LoginFormData): Promise<AuthenticateUserResponse> => {
  const existingUser = await UserModel.findOne({ email: email });

  if (!existingUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const { password: hashedPassword } = existingUser;
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
      _id: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
    },
  };
};

export const authorizeUser = async (
  credentials: Record<"username" | "password", string> | undefined,
  req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
) => {
  // Connect to the database
  await dbConnect();

  // Extract email and password from the credentials
  const usernameData = credentials?.username as unknown;
  const passwordData = credentials?.password as unknown;

  // console.log("userNameData :>> ", usernameData, passwordData);

  const validatedData = validateLoginData({ usernameData, passwordData });

  console.log("validatedData :>> ", validatedData);
  if (!validatedData.success) {
    // data validation failed
    return null;
  }

  const { username, password } = validatedData;

  // console.log("username, password validatexcd data:>> ", username, password);

  const result = await authenticateUsername({ username, password });
  // console.log("result :>> ", result);
  //? changed to return username as 'name' for consistency with github signin session
  if (result.success) {
    return {
      id: result.user._id,
      email: result.user.email,
      name: result.user.username,
    };
  }

  return null;
};
