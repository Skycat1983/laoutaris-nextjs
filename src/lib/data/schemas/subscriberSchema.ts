import { z } from "zod";

export const subscriberSchema = z.object({
  //   name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type Subscriber = z.infer<typeof subscriberSchema>;
