import { z } from "zod";

export const SUBSCRIBER_EMAIL_MAX_LENGTH = 254;

export const subscriberSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a string.",
    })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(
      SUBSCRIBER_EMAIL_MAX_LENGTH,
      `Email must be ${SUBSCRIBER_EMAIL_MAX_LENGTH} characters or fewer.`
    ),
});

export type Subscriber = z.infer<typeof subscriberSchema>;
