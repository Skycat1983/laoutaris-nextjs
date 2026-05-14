import { z } from "zod";

export const SignupFormSchema = z.object({
  // name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});

export const LoginWithUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
