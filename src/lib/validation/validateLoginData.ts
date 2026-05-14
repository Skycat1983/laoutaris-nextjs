import { LoginWithUsernameSchema } from "@/lib/data/schemas/userSchema";
import { formatFieldErrors } from "@/lib/helpers/formatFieldErrors";

interface CredentialsAuthorizeInput {
  usernameData: unknown;
  passwordData: unknown;
}

export interface CredentialsSignInFormData {
  username: string;
  password: string;
}

interface CredentialsSignInValidationSuccess {
  success: true;
  data: CredentialsSignInFormData;
}

interface CredentialsSignInValidationFailure {
  success: false;
  formValidationErrors: Partial<
    Record<keyof CredentialsSignInFormData, string>
  >;
}

type CredentialsSignInValidationResult =
  | CredentialsSignInValidationSuccess
  | CredentialsSignInValidationFailure;

export const validateCredentialsSignInData = ({
  username,
  password,
}: {
  username: unknown;
  password: unknown;
}): CredentialsSignInValidationResult => {
  const validationResult = LoginWithUsernameSchema.safeParse({
    username,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      formValidationErrors:
        formatFieldErrors<CredentialsSignInFormData>(validationResult.error),
    };
  }

  return {
    success: true,
    data: validationResult.data,
  };
};

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
}: CredentialsAuthorizeInput): LoginWithUsernameValidationResult => {
  const validationResult = validateCredentialsSignInData({
    username: usernameData,
    password: passwordData,
  });

  if (!validationResult.success) {
    return { success: false, error: "Invalid username or password" };
  } else {
    return {
      success: true,
      username: validationResult.data.username,
      password: validationResult.data.password,
    };
  }
};
