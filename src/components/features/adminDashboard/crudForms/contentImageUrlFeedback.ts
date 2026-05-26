import {
  CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR,
  isAllowedContentImageUrl,
} from "@/lib/validation/contentImageUrl";

export const CONTENT_IMAGE_URL_INVALID_URL_ERROR =
  "Enter a valid image URL before previewing.";

type ContentImageUrlFeedback =
  | {
      status: "empty";
      previewUrl: null;
      message: null;
    }
  | {
      status: "invalid";
      previewUrl: null;
      message: string;
    }
  | {
      status: "valid";
      previewUrl: string;
      message: null;
    };

export const getContentImageUrlFeedback = (
  value: string
): ContentImageUrlFeedback => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      status: "empty",
      previewUrl: null,
      message: null,
    };
  }

  try {
    new URL(trimmedValue);
  } catch {
    return {
      status: "invalid",
      previewUrl: null,
      message: CONTENT_IMAGE_URL_INVALID_URL_ERROR,
    };
  }

  if (!isAllowedContentImageUrl(trimmedValue)) {
    return {
      status: "invalid",
      previewUrl: null,
      message: CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR,
    };
  }

  return {
    status: "valid",
    previewUrl: trimmedValue,
    message: null,
  };
};
