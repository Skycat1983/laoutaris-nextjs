import { z } from "zod";

export const ENQUIRY_FIELD_LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 4000,
  productHandle: 120,
} as const;

const requiredTrimmedString = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .trim();

export const productHandleSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== "string") {
      return value;
    }

    const normalizedValue = value.trim().toLowerCase();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  },
  z
    .string({
      invalid_type_error: "Product handle must be a string",
    })
    .max(
      ENQUIRY_FIELD_LIMITS.productHandle,
      `Product handle must be ${ENQUIRY_FIELD_LIMITS.productHandle} characters or fewer.`
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Product handle must contain only lowercase letters, numbers, and hyphens."
    )
    .optional()
);

export const normalizeProductHandle = (
  productHandle: unknown
): string | undefined => {
  const parsedProductHandle = productHandleSchema.safeParse(productHandle);

  return parsedProductHandle.success ? parsedProductHandle.data : undefined;
};

export const enquirySchema = z.object({
  name: requiredTrimmedString("Name")
    .min(2, "Name must be at least 2 characters.")
    .max(
      ENQUIRY_FIELD_LIMITS.name,
      `Name must be ${ENQUIRY_FIELD_LIMITS.name} characters or fewer.`
    ),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(
      ENQUIRY_FIELD_LIMITS.email,
      `Email must be ${ENQUIRY_FIELD_LIMITS.email} characters or fewer.`
    ),
  subject: requiredTrimmedString("Subject")
    .min(2, "Subject must be at least 2 characters.")
    .max(
      ENQUIRY_FIELD_LIMITS.subject,
      `Subject must be ${ENQUIRY_FIELD_LIMITS.subject} characters or fewer.`
    ),
  message: requiredTrimmedString("Message")
    .min(10, "Message must be at least 10 characters.")
    .max(
      ENQUIRY_FIELD_LIMITS.message,
      `Message must be ${ENQUIRY_FIELD_LIMITS.message} characters or fewer.`
    ),
  productHandle: productHandleSchema,
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
