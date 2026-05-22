"use server";

import dbConnect from "@/lib/db/mongodb";
import {
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME,
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE,
  ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE,
  createAccountPrivacyAcknowledgement,
} from "@/lib/constants";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { validateRegistrationData } from "../validation/validateRegistrationData";
import { registerUser } from "./registerUser";

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
  accountPrivacyAcknowledged: boolean;
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
  const accountPrivacyAcknowledged =
    formData.get(ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME) ===
    ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE;

  const validationErrors = validateRegistrationData(email, password, username);
  const formValidationErrors: Partial<Record<keyof SignUpFormData, string>> = {
    ...validationErrors.formValidationErrors,
  };

  if (!accountPrivacyAcknowledged) {
    formValidationErrors.accountPrivacyAcknowledged =
      ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE;
  }

  const hasValidationErrors =
    Object.keys(formValidationErrors).length > 0;

  if (hasValidationErrors) {
    return {
      type: "validation",
      formValidationErrors,
    };
  }

  try {
    // Try to register the user
    const result = await registerUser({
      email,
      username,
      password,
      accountPrivacyAcknowledgement: createAccountPrivacyAcknowledgement({
        acceptedBy: "credentials",
        provider: "credentials",
        sourceSurface: "credentials-signup",
      }),
    });

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
