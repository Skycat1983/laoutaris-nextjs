import { UserModel } from "@/lib/server/models";
import { verifyPassword } from "@/utils/bcrypt";
import { LoginFormData } from "../actions/processLogin";

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
