"use server";

import { SignupFormSchema } from "@/lib/definitions";
import { createUser } from "@/lib/server/user/createUser";
import { loginUser } from "@/lib/server/user/loginUser";

interface SignUpFormValidationErrors {
  email: string;
  password: string;
  username: string;
}

interface CreateUserResponse {
  formValidationErrors: SignUpFormValidationErrors;
  authError: string | null;
  user: "user" | null;
}

export async function signUp(
  prevState: any,
  formData: FormData
): Promise<CreateUserResponse> {
  "use server";

  let email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const validationResult = SignupFormSchema.safeParse({
    email,
    password,
    username,
  });

  validationResult.success && (email = email as string);

  console.log("validation success");

  if (!validationResult.success) {
    const formValidationErrors: SignUpFormValidationErrors = {
      email: "",
      password: "",
      username: "",
    };

    const fieldErrors = validationResult.error.flatten().fieldErrors;
    if (fieldErrors.email) {
      formValidationErrors.email = fieldErrors.email[0];
    }
    if (fieldErrors.password) {
      formValidationErrors.password = fieldErrors.password[0];
    }
    console.log("field errors found");
    return { formValidationErrors, authError: null, user: null };
  }

  try {
    const result = await createUser({ email, password, username });
    console.log("result", result);
    return {
      formValidationErrors: { email: "", password: "", username: "" },
      authError: null,
      user: "user",
    };
  } catch (error) {
    return {
      formValidationErrors: { email: "", password: "", username: "" },
      authError: "auth error",
      user: null,
    };
  }
}

interface LoginFormValidationErrors {
  email: string;
  password: string;
}

interface LoginUserResponse {
  formValidationErrors: LoginFormValidationErrors;
  authError: string | null;
  user: "user" | null;
}

export async function signIn(
  prevState: any,
  formData: FormData
): Promise<LoginUserResponse> {
  "use server";

  let email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationResult = SignupFormSchema.safeParse({
    email,
    password,
  });

  validationResult.success && (email = email as string);

  console.log("validation success");

  if (!validationResult.success) {
    const formValidationErrors: LoginFormValidationErrors = {
      email: "",
      password: "",
    };

    const fieldErrors = validationResult.error.flatten().fieldErrors;
    if (fieldErrors.email) {
      formValidationErrors.email = fieldErrors.email[0];
    }
    if (fieldErrors.password) {
      formValidationErrors.password = fieldErrors.password[0];
    }
    console.log("field errors found");
    return { formValidationErrors, authError: null, user: null };
  }

  try {
    // const result = await loginUser({ email, password });
    // console.log("result", result);
    return {
      formValidationErrors: { email: "", password: "" },
      authError: null,
      user: "user",
    };
  } catch (error) {
    return {
      formValidationErrors: { email: "", password: "" },
      authError: "auth error",
      user: null,
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

export async function logout(prevState: any): Promise<LogoutUserResponse> {
  "use server";
  console.log("signing out");
  return {
    formValidationErrors: { logout: "" },
    authError: null,
    user: "user",
  };
}
