import { UserModel } from "@/lib/data/models";
import { FrontendUserWithFavourites } from "@/lib/data/types/userTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();

  try {
    const rawUserFavourites = await UserModel.findById(userId)
      .select("favourites")
      .populate("favourites")
      .lean()
      .exec();

    if (!rawUserFavourites) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const userFavourites =
      transformMongooseDoc<FrontendUserWithFavourites>(rawUserFavourites);

    // console.log("userFavourites", userFavourites);

    return NextResponse.json({
      success: true,
      data: userFavourites,
    } satisfies ApiSuccessResponse<FrontendUserWithFavourites>);
  } catch (error) {
    console.error("Error fetching user favourites:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user favourites",
    } satisfies ApiErrorResponse);
  }
}
