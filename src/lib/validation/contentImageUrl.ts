import { z } from "zod";

export const CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR =
  "Image URL must use the configured Cloudinary, Flaticon, or Shopify CDN host";

export const CONTENT_IMAGE_URL_ALLOWED_SOURCES = [
  {
    protocol: "https:",
    hostname: "res.cloudinary.com",
    pathnamePrefix: "/dzncmfirr/",
  },
  {
    protocol: "https:",
    hostname: "cdn-icons-png.flaticon.com",
    pathnamePrefix: "/",
  },
  {
    protocol: "https:",
    hostname: "cdn.shopify.com",
    pathnamePrefix: "/",
  },
] as const;

type ContentImageUrlSchemaOptions = {
  requiredError: string;
  invalidTypeError: string;
  invalidUrlError: string;
  maxLength: number;
  maxLengthError: string;
};

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const isAllowedParsedContentImageUrl = (url: URL): boolean => {
  if (url.username || url.password || url.port) {
    return false;
  }

  return CONTENT_IMAGE_URL_ALLOWED_SOURCES.some((source) => {
    return (
      url.protocol === source.protocol &&
      url.hostname === source.hostname &&
      url.pathname.startsWith(source.pathnamePrefix)
    );
  });
};

export const isAllowedContentImageUrl = (value: string): boolean => {
  const parsedUrl = parseUrl(value.trim());

  return parsedUrl !== null && isAllowedParsedContentImageUrl(parsedUrl);
};

export const buildContentImageUrlSchema = ({
  requiredError,
  invalidTypeError,
  invalidUrlError,
  maxLength,
  maxLengthError,
}: ContentImageUrlSchemaOptions) =>
  z
    .string({
      required_error: requiredError,
      invalid_type_error: invalidTypeError,
    })
    .trim()
    .max(maxLength, maxLengthError)
    .superRefine((value, ctx) => {
      const parsedUrl = parseUrl(value);

      if (!parsedUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: invalidUrlError,
        });
        return;
      }

      if (!isAllowedParsedContentImageUrl(parsedUrl)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR,
        });
      }
    });
