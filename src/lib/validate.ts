import { formatFieldErrors } from "@/utils/formatFieldErrors";
import { LoginFormSchema, SignupFormSchema } from "./definitions";

type SignupFormData = {
  email: string;
  password: string;
  username: string;
};

interface ValidationResult<T> {
  formValidationErrors: Partial<Record<keyof T, string>>;
}

export const validateSignup = (
  email: string,
  password: string,
  username: string
): ValidationResult<SignupFormData> => {
  const validationResult = SignupFormSchema.safeParse({
    email,
    password,
    username,
  });

  if (!validationResult.success) {
    const formValidationErrors = formatFieldErrors<SignupFormData>(
      validationResult.error
    );
    return { formValidationErrors };
  }

  return { formValidationErrors: {} };
};

type LoginFormData = {
  email: string;
  password: string;
};

export const validateLogin = (
  formData: FormData
): ValidationResult<LoginFormData> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationResult = LoginFormSchema.safeParse({
    email,
    password,
  });

  if (!validationResult.success) {
    const formValidationErrors = formatFieldErrors<LoginFormData>(
      validationResult.error
    );
    return { formValidationErrors };
  }

  return { formValidationErrors: {} };
};

// const formValidationErrors: Partial<Record<keyof SignupFormData, string>> =
//   {};

// const fieldErrors = validationResult.error.flatten().fieldErrors;
// if (fieldErrors.email) {
//   formValidationErrors.email = fieldErrors.email[0];
// }
// if (fieldErrors.password) {
//   formValidationErrors.password = fieldErrors.password[0];
// }
// if (fieldErrors.username) {
//   formValidationErrors.username = fieldErrors.username[0];
// }

// return { formValidationErrors };
