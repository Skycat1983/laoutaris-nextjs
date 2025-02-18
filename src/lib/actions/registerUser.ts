import { SignUpFormData } from "@/lib/actions/processRegistration";
import { UserModel } from "@/lib/data/models";
import { encryptPassword } from "@/lib/shared/helpers/bcrypt";
import { getErrorMessage } from "@/lib/shared/helpers/getErrorMessage";

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
}: SignUpFormData): Promise<RegisterUserResponse> => {
  try {
    console.log("email, username, password", email, username, password);

    // Encrypt the password
    const hashedPassword = await encryptPassword(password);
    console.log("hashedPassword", hashedPassword);

    // Create a new user instance
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
    });
    console.log("newUser :>> ", newUser);

    // Save the user to the database
    const result = await newUser.save();
    console.log("result :>> ", result);

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
    console.log("Error registering user:", error);
    const errorMessage = getErrorMessage(error);

    // Return error response
    return {
      success: false,
      error: errorMessage,
    };
  }
};
