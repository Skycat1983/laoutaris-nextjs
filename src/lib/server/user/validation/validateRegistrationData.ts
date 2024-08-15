import { SignupFormSchema } from "@/lib/server/schemas/definitions";
import { formatFieldErrors } from "@/utils/formatFieldErrors";

type SignupFormData = {
  email: string;
  password: string;
  username: string;
};

interface ValidationResult<T> {
  formValidationErrors: Partial<Record<keyof T, string>>;
}

export const validateRegistrationData = (
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
