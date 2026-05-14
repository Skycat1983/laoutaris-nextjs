import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";

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

  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinaryApiSecret) {
    return errorResponse("Cloudinary signing is not configured", 500);
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
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
