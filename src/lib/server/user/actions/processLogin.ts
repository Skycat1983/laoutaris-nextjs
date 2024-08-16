"use server";

import dbConnect from "@/utils/mongodb";
import { validateLoginData } from "../validation/validateLoginData";
import {
  authenticateUser,
  authenticateUsername,
} from "../data-fetching/authenticateUser";
import { createSession } from "../session/session";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginWithUsernameFormData {
  username: string;
  password: string;
}

interface LoginValidationErrorResult {
  type: "validation";
  formValidationErrors: Partial<Record<keyof LoginFormData, string>>;
}

interface AuthErrorResult {
  type: "auth";
  authError: string;
}

interface SuccessResult {
  type: "success";
  user: { _id: string; email: string; username: string };
}

export type LoginProcessResponse =
  | LoginValidationErrorResult
  | AuthErrorResult
  | SuccessResult;

// export async function processLogin(
//   prevState: LoginProcessResponse,
//   formData: FormData
// ): Promise<LoginProcessResponse> {
//   await dbConnect();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   const validationErrors = validateLoginData(email, password);

//   const hasValidationErrors =
//     Object.keys(validationErrors.formValidationErrors).length > 0;

//   if (hasValidationErrors) {
//     return {
//       type: "validation",
//       formValidationErrors: validationErrors.formValidationErrors,
//     };
//   }

//   try {
//     // Try to authenticate the user
//     const result = await authenticateUser({ email, password });
//     // const result = await authenticateUsername({ email, password });

//     // Handle the authenticateUser result
//     if (result.success) {
//       await createSession({ email, password });

//       return {
//         type: "success",
//         user: result.user,
//       };
//     } else {
//       return {
//         type: "auth",
//         authError: result.error,
//       };
//     }
//   } catch (error: any) {
//     console.error("Error during sign-in:", error);

//     const errorMessage =
//       error?.message || "An unexpected error occurred during sign-in.";

//     return {
//       type: "auth",
//       authError: errorMessage,
//     };
//   }
// }
