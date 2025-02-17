import { UserModel } from "@/lib/data/models";
import { FrontendUserWithWatchlist } from "@/lib/data/types/userTypes";
import { getUserIdFromSession } from "@/lib/old_code/user/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();

  try {
    const rawUserWatchlist = await UserModel.findById(userId)
      .select("watchlist")
      .populate("watchlist")
      .lean()
      .exec();

    if (!rawUserWatchlist) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const userWatchlist =
      transformMongooseDoc<FrontendUserWithWatchlist>(rawUserWatchlist);

    return NextResponse.json({
      success: true,
      data: userWatchlist,
    } satisfies ApiSuccessResponse<FrontendUserWithWatchlist>);
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user watchlist",
    } satisfies ApiErrorResponse);
  }
}
