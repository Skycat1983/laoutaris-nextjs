import { IFrontendSubscriber } from "@/lib/client/types/subscriberTypes";
import { SubscriberModel } from "@/lib/server/models";
import { replaceMongoIdInArray } from "@/utils/transformData";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  console.log("slug in GET biography slug", email);

  if (!email) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 400,
        message: "Email parameter is missing",
      },
      { status: 400 }
    );
  }

  try {
    const rawContent = (await SubscriberModel.findOne({
      email,
    }).lean()) as IFrontendSubscriber;

    if (!rawContent) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Subscriber not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<IFrontendSubscriber>>({
      success: true,
      data: rawContent,
    });
  } catch (error) {
    console.error("Error fetching article", error);
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

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 400,
          message: "Name and email are required",
        },
        { status: 400 }
      );
    }

    // const existingSubscriber = await SubscriberModel.findOne({ email }).lean();

    // if (existingSubscriber) {
    //   return NextResponse.json<ApiErrorResponse>(
    //     {
    //       success: false,
    //       errorCode: 409, // Conflict
    //       message: "Subscriber already exists",
    //     },
    //     { status: 409 }
    //   );
    // }

    const newSubscriber = await SubscriberModel.create({ name, email });

    return NextResponse.json<ApiSuccessResponse<IFrontendSubscriber>>({
      success: true,
      data: newSubscriber,
    });
  } catch (error) {
    console.error("Error creating subscriber", error);
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
