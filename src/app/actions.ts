"use server";

import { registerUser } from "@/lib/server/user/registerUser";
import { authenticateUser } from "@/lib/server/user/authenticateUser";
import { validateLoginData, validateRegistrationData } from "@/lib/validate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import dbConnect from "@/utils/mongodb";

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
  "use server";
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

export interface LoginFormData {
  email: string;
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

export async function processLogin(
  prevState: LoginProcessResponse,
  formData: FormData
): Promise<LoginProcessResponse> {
  "use server";
  await dbConnect();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationErrors = validateLoginData(email, password);

  const hasValidationErrors =
    Object.keys(validationErrors.formValidationErrors).length > 0;

  if (hasValidationErrors) {
    return {
      type: "validation",
      formValidationErrors: validationErrors.formValidationErrors,
    };
  }

  try {
    // Try to authenticate the user
    const result = await authenticateUser({ email, password });

    // Handle the authenticateUser result
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
  } catch (error: any) {
    console.error("Error during sign-in:", error);

    const errorMessage =
      error?.message || "An unexpected error occurred during sign-in.";

    return {
      type: "auth",
      authError: errorMessage,
    };
  }
}

interface LogoutFormValidationErrors {
  logout: string;
}

interface LogoutUserResponse {
  formValidationErrors: LogoutFormValidationErrors;
  authError: string | null;
  user: "user" | null;
}

export async function processLogout(
  prevState: any
): Promise<LogoutUserResponse> {
  "use server";
  console.log("signing out");
  return {
    formValidationErrors: { logout: "" },
    authError: null,
    user: "user",
  };
}

interface LogoutFormValidationErrors {
  logout: string;
}

interface LogoutUserResponse {
  formValidationErrors: LogoutFormValidationErrors;
  authError: string | null;
  user: "user" | null;
}

export async function logout(prevState: any): Promise<LogoutUserResponse> {
  "use server";
  console.log("signing out");
  return {
    formValidationErrors: { logout: "" },
    authError: null,
    user: "user",
  };
}

// export interface SignUpFormData {
//   email: string;
//   password: string;
//   username: string;
// }

// interface SignUpValidationErrorResult {
//   type: "validation";
//   formValidationErrors: Partial<Record<keyof SignUpFormData, string>>;
// }

// interface AuthErrorResult {
//   type: "auth";
//   authError: string;
// }

// interface SuccessResult {
//   type: "success";
//   user: { _id: string; email: string; username: string };
// }

// export type SignupResponse =
//   | SignUpValidationErrorResult
//   | AuthErrorResult
//   | SuccessResult;

// export async function signUpAction(
//   state: SignupResponse,
//   formData: FormData
// ): Promise<SignupResponse> {
//   "use server";
//   await dbConnect();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const username = formData.get("username") as string;

//   const validationErrors = validateSignup(email, password, username);

//   const hasValidationErrors =
//     Object.keys(validationErrors.formValidationErrors).length > 0;

//   if (hasValidationErrors) {
//     return {
//       type: "validation",
//       formValidationErrors: validationErrors.formValidationErrors,
//     };
//   }

//   try {
//     // Try to create the user
//     const result = await createUser({ email, username, password });

//     // Handle the createUser result
//     if (result.success) {
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
//   } catch (error) {
//     const errorMessage = getErrorMessage(error);
//     return {
//       type: "auth",
//       authError: errorMessage,
//     };
//   }
// }

// export interface LoginFormData {
//   email: string;
//   password: string;
// }

// interface LoginValidationErrorResult {
//   type: "validation";
//   formValidationErrors: Partial<Record<keyof LoginFormData, string>>;
// }

// interface AuthErrorResult {
//   type: "auth";
//   authError: string;
// }

// interface SuccessResult {
//   type: "success";
//   user: { _id: string; email: string; username: string };
// }

// export type LoginResponse =
//   | LoginValidationErrorResult
//   | AuthErrorResult
//   | SuccessResult;
// export async function signInAction(
//   prevState: LoginResponse,
//   formData: FormData
// ): Promise<LoginResponse> {
//   "use server";
//   await dbConnect();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   const validationErrors = validateLogin(email, password);

//   const hasValidationErrors =
//     Object.keys(validationErrors.formValidationErrors).length > 0;

//   if (hasValidationErrors) {
//     return {
//       type: "validation",
//       formValidationErrors: validationErrors.formValidationErrors,
//     };
//   }

//   try {
//     // Try to create the user
//     const result = await loginUser({ email, password });

//     // Handle the createUser result
//     if (result.success) {
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

// interface LogoutFormValidationErrors {
//   logout: string;
// }

// interface LogoutUserResponse {
//   formValidationErrors: LogoutFormValidationErrors;
//   authError: string | null;
//   user: "user" | null;
// }

// export async function logout(prevState: any): Promise<LogoutUserResponse> {
//   "use server";
//   console.log("signing out");
//   return {
//     formValidationErrors: { logout: "" },
//     authError: null,
//     user: "user",
//   };
// }
