import { z } from "zod";

export const SignupFormSchema = z.object({
  // name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5),
});
