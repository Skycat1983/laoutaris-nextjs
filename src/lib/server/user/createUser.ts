import { SignUpFormData } from "@/app/actions";
import { encrypt } from "@/lib/auth";
import { IUser, UserModel } from "@/lib/models";
import { ISignupData } from "@/lib/types/userTypes";
import { encryptPassword } from "@/utils/bcrypt";
import { getErrorMessage } from "@/utils/getErrorMessage";
// import { encryptPassword } from "@/utils/bcrypt";

interface CreateUserSuccess {
  success: true;
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
  };
}

interface CreateUserError {
  success: false;
  error: string;
}

type CreateUserResponse = CreateUserSuccess | CreateUserError;

export const createUser = async ({
  email,
  username,
  password,
}: SignUpFormData): Promise<CreateUserResponse> => {
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
    console.log("Error creating user:", error);
    const errorMessage = getErrorMessage(error);

    // Return error response
    return {
      success: false,
      error: errorMessage,
    };
  }
};
