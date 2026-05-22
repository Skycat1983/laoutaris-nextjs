import { UserModel } from "@/lib/data/models";
import { encryptPassword } from "@/lib/helpers/bcrypt";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import type { AccountPrivacyAcknowledgement } from "@/lib/constants";

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  accountPrivacyAcknowledgement: AccountPrivacyAcknowledgement;
}

interface RegisterUserSuccess {
  success: true;
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
  };
}

interface RegisterUserError {
  success: false;
  error: string;
}

type RegisterUserResponse = RegisterUserSuccess | RegisterUserError;

export const registerUser = async ({
  email,
  username,
  password,
  accountPrivacyAcknowledgement,
}: RegisterUserInput): Promise<RegisterUserResponse> => {
  try {
    // Encrypt the password
    const hashedPassword = await encryptPassword(password);

    // Create a new user instance
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
      accountPrivacyAcknowledgement,
    });

    // Save the user to the database
    const result = await newUser.save();

    // Return success response
    return {
      success: true,
      message: "User created successfully",
      user: {
        _id: result._id,
        email: result.email,
        username: result.username,
      },
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // Return error response
    return {
      success: false,
      error: errorMessage,
    };
  }
};
