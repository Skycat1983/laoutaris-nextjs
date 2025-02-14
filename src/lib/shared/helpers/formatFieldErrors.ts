import { z } from "zod";

export function formatFieldErrors<T>(
  errors: z.ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors = errors.flatten().fieldErrors;
  const formValidationErrors: Partial<Record<keyof T, string>> = {};

  for (const key in fieldErrors) {
    const errorMessages = fieldErrors[key]; // save the value to a variable
    if (errorMessages && errorMessages.length > 0) {
      // check if it is defined and not empty
      formValidationErrors[key as keyof T] = errorMessages[0]; // Now safe to access errorMessages[0]
    }
  }

  return formValidationErrors;
}
