import { IFrontendEnquiry } from "@/lib/types/enquiryTypes";
import { EnquiryModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

// TODO: delete or use
// ! currently unused as we handle all this in lib/server/enquiry
export async function POST(request: NextRequest): Promise<NextResponse> {
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

    console.log("newEnquiry in POST enquiry :>> ", newEnquiry);

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
