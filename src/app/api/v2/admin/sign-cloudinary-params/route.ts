import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";

// this route is used to sign the cloudinary params
// it is called by the UploadButton component
// we need to sign the params because the cloudinary widget needs to send the params to the server
// it works by sending the params to the server and then signing them with the api secret

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinarySigningResponse = {
  success: true;
  signature: string;
  data: {
    signature: string;
  };
};

type AllowedCloudinarySigningParam = "timestamp" | "upload_preset" | "source";
type CloudinarySigningParams = Partial<
  Record<AllowedCloudinarySigningParam, string | number>
>;

const CURRENT_UPLOAD_PRESET = "laoutaris_art";
const ALLOWED_SIGNING_PARAM_KEYS = new Set<AllowedCloudinarySigningParam>([
  "timestamp",
  "upload_preset",
  "source",
]);

const errorResponse = (error: string, status: 400 | 500) =>
  NextResponse.json(
    {
      success: false,
      error,
    } satisfies ApiErrorResponse,
    { status }
  );

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const isValidTimestamp = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return false;
  }

  const numericValue = Number(value);
  return Number.isSafeInteger(numericValue) && numericValue > 0;
};

const validateParamsToSign = (
  paramsToSign: Record<string, unknown>
): CloudinarySigningParams | string => {
  const validatedParams: CloudinarySigningParams = {};

  if (!Object.prototype.hasOwnProperty.call(paramsToSign, "timestamp")) {
    return "Cloudinary signing param timestamp is required";
  }

  if (!Object.prototype.hasOwnProperty.call(paramsToSign, "upload_preset")) {
    return "Cloudinary signing param upload_preset is required";
  }

  for (const [key, value] of Object.entries(paramsToSign)) {
    if (!ALLOWED_SIGNING_PARAM_KEYS.has(key as AllowedCloudinarySigningParam)) {
      return `Unsupported Cloudinary signing param: ${key}`;
    }

    if (key === "timestamp") {
      if (!isValidTimestamp(value)) {
        return "Cloudinary signing param timestamp must be a positive integer";
      }
      validatedParams.timestamp = value as string | number;
      continue;
    }

    if (key === "upload_preset") {
      if (value !== CURRENT_UPLOAD_PRESET) {
        return "Cloudinary signing param upload_preset is not allowed";
      }
      validatedParams.upload_preset = value;
      continue;
    }

    if (key === "source") {
      if (value !== "uw") {
        return "Cloudinary signing param source is not allowed";
      }
      validatedParams.source = value;
    }
  }

  return validatedParams;
};

export async function POST(request: Request) {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be a JSON object", 400);
  }

  if (!isPlainObject(body)) {
    return errorResponse("Request body must be a JSON object", 400);
  }

  const { paramsToSign } = body;

  if (!isPlainObject(paramsToSign)) {
    return errorResponse("paramsToSign must be a JSON object", 400);
  }

  const validatedParamsToSign = validateParamsToSign(paramsToSign);
  if (typeof validatedParamsToSign === "string") {
    return errorResponse(validatedParamsToSign, 400);
  }

  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinaryApiSecret) {
    return errorResponse("Cloudinary signing is not configured", 500);
  }

  const signature = cloudinary.utils.api_sign_request(
    validatedParamsToSign,
    cloudinaryApiSecret
  );

  return NextResponse.json({
    success: true,
    signature,
    data: {
      signature,
    },
  } satisfies CloudinarySigningResponse);
}
