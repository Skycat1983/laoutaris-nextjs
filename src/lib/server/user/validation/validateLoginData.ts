import { LoginFormSchema } from "@/lib/server/schemas/definitions";
import { formatFieldErrors } from "@/utils/formatFieldErrors";

type LoginFormData = {
  email: string;
  password: string;
};

interface ValidationResult<T> {
  formValidationErrors: Partial<Record<keyof T, string>>;
}

export const validateLoginData = (
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
