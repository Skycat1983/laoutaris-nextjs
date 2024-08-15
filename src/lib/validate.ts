// import { formatFieldErrors } from "@/utils/formatFieldErrors";
// import {
//   LoginFormSchema,
//   SignupFormSchema,
// } from "./server/schemas/definitions";

// type SignupFormData = {
//   email: string;
//   password: string;
//   username: string;
// };

// interface ValidationResult<T> {
//   formValidationErrors: Partial<Record<keyof T, string>>;
// }

// export const validateRegistrationData = (
//   email: string,
//   password: string,
//   username: string
// ): ValidationResult<SignupFormData> => {
//   const validationResult = SignupFormSchema.safeParse({
//     email,
//     password,
//     username,
//   });

//   if (!validationResult.success) {
//     const formValidationErrors = formatFieldErrors<SignupFormData>(
//       validationResult.error
//     );
//     return { formValidationErrors };
//   }

//   return { formValidationErrors: {} };
// };

// type LoginFormData = {
//   email: string;
//   password: string;
// };

// export const validateLoginData = (
//   email: string,
//   password: string
// ): ValidationResult<LoginFormData> => {
//   const validationResult = LoginFormSchema.safeParse({
//     email,
//     password,
//   });

//   if (!validationResult.success) {
//     const formValidationErrors = formatFieldErrors<LoginFormData>(
//       validationResult.error
//     );
//     return { formValidationErrors };
//   }
//   return { formValidationErrors: {} };
// };

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
