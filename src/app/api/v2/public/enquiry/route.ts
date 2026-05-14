import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { ApiErrorResponse } from "@/lib/data/types";
import { ApiEnquiryResult } from "@/lib/api/public/enquiry/fetchers";
import { EnquiryModel } from "@/lib/data/models/enquiryModel";
import {
  enquirySchema,
  type EnquiryInput,
} from "@/lib/data/schemas/enquirySchema";

type EnquiryFieldErrors = Partial<
  Record<keyof EnquiryInput, string[] | undefined>
>;

type EnquiryValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: EnquiryFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: EnquiryFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<EnquiryValidationErrorResponse>(
    {
      success: false,
      error: "Invalid enquiry input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationErrorResponse(
      {},
      ["Request body must be valid JSON."]
    );
  }

  const parsedBody = enquirySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();
    const enquiry = await EnquiryModel.create(parsedBody.data);

    if (!enquiry) {
      return errorResponse("Enquiry could not be created", 500);
    }

    return NextResponse.json<ApiEnquiryResult>({
      success: true,
      message: "Enquiry received",
      data: {
        success: true,
        message: "Enquiry received",
      },
    });
  } catch {
    return errorResponse("Enquiry could not be created", 500);
  }
}
