import { IFrontendEnquiry } from "@/lib/client/types/enquiryTypes";
import { EnquiryModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { name, email, enquiryType, message } = await request.json();

    if (!name || !email || !enquiryType || !message) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 400,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const newEnquiry = await EnquiryModel.create({
      name,
      email,
      enquiryType,
      message,
    });

    return NextResponse.json<ApiSuccessResponse<IFrontendEnquiry>>({
      success: true,
      data: newEnquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
