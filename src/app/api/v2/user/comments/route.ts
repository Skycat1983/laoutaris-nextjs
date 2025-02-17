import { UserModel } from "@/lib/data/models";
import { FrontendUserWithComments } from "@/lib/data/types/userTypes";
import { getUserIdFromSession } from "@/lib/old_code/user/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();

  try {
    const rawUserComments = await UserModel.findById(userId)
      .select("comments")
      .lean()
      .exec();

    if (!rawUserComments) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const userComments =
      transformMongooseDoc<FrontendUserWithComments>(rawUserComments);

    return NextResponse.json({
      success: true,
      data: userComments,
    } satisfies ApiSuccessResponse<FrontendUserWithComments>);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user comments",
    } satisfies ApiErrorResponse);
  }
}
