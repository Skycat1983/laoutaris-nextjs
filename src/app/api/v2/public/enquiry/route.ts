import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";
import { ApiEnquiryResult } from "@/lib/api/public/enquiry/fetchers";
import { EnquiryModel } from "@/lib/data/models";
export async function POST(
  request: NextRequest
): Promise<RouteResponse<ApiEnquiryResult>> {
  try {
    const body = await request.json();
    const enquiry = await EnquiryModel.create(body);
    if (!enquiry) {
      return NextResponse.json({
        success: false,
        message: "Enquiry not created",
        error: "Enquiry not created",
        errorCode: 500,
      } satisfies ApiErrorResponse);
    }
    console.log(body);
    return NextResponse.json({
      success: true,
      message: "Enquiry received",
      data: enquiry,
    } satisfies ApiEnquiryResult);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Enquiry not created",
      error: error instanceof Error ? error.message : "Unknown error",
      errorCode: 500,
    } satisfies ApiErrorResponse);
  }
}
