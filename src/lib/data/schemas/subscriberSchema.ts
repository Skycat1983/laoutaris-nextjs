import { z } from "zod";

export const SUBSCRIBER_EMAIL_MAX_LENGTH = 254;
export const SUBSCRIBER_SOURCE_PATH_MAX_LENGTH = 256;
export const NEWSLETTER_CONSENT_VERSION = "2026-05-22-owner-approval-v1";
export const NEWSLETTER_CONSENT_TEXT =
  "I agree to receive newsletter emails about Joseph Laoutaris Art Archive updates and understand I can unsubscribe at any time.";
export const NEWSLETTER_CONSENT_TEXT_SOURCE =
  "docs/prototypes/compliance-owner-decision-packet.md#owner-response-sheet";
export const NEWSLETTER_CONSENT_FIELD_VALUE = "accepted";

const publicPathPattern = /^\/[A-Za-z0-9/_-]*$/;

export const normalizeNewsletterSourcePath = (value: unknown) => {
  if (typeof value !== "string") {
    return "/";
  }

  const sourcePath = value.trim();

  if (
    sourcePath.length === 0 ||
    sourcePath.length > SUBSCRIBER_SOURCE_PATH_MAX_LENGTH ||
    !publicPathPattern.test(sourcePath)
  ) {
    return "/";
  }

  return sourcePath;
};

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

export const subscriptionFormSchema = subscriberSchema.extend({
  newsletterConsent: z.literal(NEWSLETTER_CONSENT_FIELD_VALUE, {
    errorMap: () => ({
      message: "Please confirm newsletter consent before subscribing.",
    }),
  }),
  sourcePath: z.preprocess(
    normalizeNewsletterSourcePath,
    z.string().max(SUBSCRIBER_SOURCE_PATH_MAX_LENGTH)
  ),
});

export type SubscriptionFormInput = z.infer<typeof subscriptionFormSchema>;

export const unsubscribeTokenSchema = z
  .string({
    required_error: "Unsubscribe link is invalid.",
    invalid_type_error: "Unsubscribe link is invalid.",
  })
  .trim()
  .regex(/^[A-Za-z0-9_-]{32,128}$/, "Unsubscribe link is invalid.");
