"use server";

import dbConnect from "@/utils/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { validateRegistrationData } from "./server/user/validation/validateRegistrationData";
import { registerUser } from "./server/user/data-fetching/registerUser";

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

interface RegistrationValidationErrorResult {
  type: "validation";
  formValidationErrors: Partial<Record<keyof SignUpFormData, string>>;
}

interface AuthErrorResult {
  type: "auth";
  authError: string;
}

interface SuccessResult {
  type: "success";
  user: { _id: string; email: string; username: string };
}

export type RegistrationResponse =
  | RegistrationValidationErrorResult
  | AuthErrorResult
  | SuccessResult;

export async function processRegistration(
  state: RegistrationResponse,
  formData: FormData
): Promise<RegistrationResponse> {
  await dbConnect();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const validationErrors = validateRegistrationData(email, password, username);

  const hasValidationErrors =
    Object.keys(validationErrors.formValidationErrors).length > 0;

  if (hasValidationErrors) {
    return {
      type: "validation",
      formValidationErrors: validationErrors.formValidationErrors,
    };
  }

  try {
    // Try to register the user
    const result = await registerUser({ email, username, password });

    // Handle the registerUser result
    if (result.success) {
      return {
        type: "success",
        user: result.user,
      };
    } else {
      return {
        type: "auth",
        authError: result.error,
      };
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return {
      type: "auth",
      authError: errorMessage,
    };
  }
}
