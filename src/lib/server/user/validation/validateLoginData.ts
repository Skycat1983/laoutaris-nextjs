import {
  LoginFormSchema,
  LoginWithUsernameSchema,
} from "@/lib/server/schemas/definitions";
import { formatFieldErrors } from "@/utils/formatFieldErrors";

// type LoginFormData = {
//   email: string;
//   password: string;
// };

interface ValidationResult<T> {
  formValidationErrors: Partial<Record<keyof T, string>>;
}

export const validateLogin = (
  email: string,
  password: string
): ValidationResult<LoginFormData> => {
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

interface LoginFormData {
  usernameData: unknown;
  passwordData: unknown;
}

interface LoginValidationSuccess {
  success: true;
  username: string;
  password: string;
}

interface LoginValidationFailure {
  success: false;
  error: string;
}

type LoginWithUsernameValidationResult =
  | LoginValidationSuccess
  | LoginValidationFailure;

export const validateLoginData = ({
  usernameData,
  passwordData,
}: LoginFormData): LoginWithUsernameValidationResult => {
  const validationResult = LoginWithUsernameSchema.safeParse({
    usernameData,
    passwordData,
  });

  if (!validationResult.success) {
    return { success: false, error: "Invalid username or password" };
  } else {
    return {
      success: true,
      username: validationResult.data.usernameData as string,
      password: validationResult.data.passwordData as string,
    };
  }
};
