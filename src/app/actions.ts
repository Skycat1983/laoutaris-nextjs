"use server";

import { SignupFormSchema } from "@/lib/definitions";

interface FormValidationErrors {
  email: string;
  password: string;
}

interface CreateUserResponse {
  formValidationErrors: FormValidationErrors;
  authError: string | null;
  user: "user" | null;
}

export async function createUser(
  prevState: any,
  formData: FormData
): Promise<CreateUserResponse> {
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
    const formValidationErrors: FormValidationErrors = {
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
