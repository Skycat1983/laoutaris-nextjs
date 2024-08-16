import { z } from "zod";

export const SignupFormSchema = z.object({
  // name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginWithUsernameSchema = z.object({
  usernameData: z.string().min(5),
  passwordData: z.string().min(8),
});
