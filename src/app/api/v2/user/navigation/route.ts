import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import {
  OwnUserNavDataLean,
  OwnUserNavFields,
} from "@/lib/data/types/navigationTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiOwnUserNavResult>> {
  const userId = await getUserIdFromSession();

  try {
    const rawUserData = await UserModel.findById(userId)
      .select("favourites watchlist comments")
      .lean<OwnUserNavDataLean>();

    if (!rawUserData) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const user = transformMongooseDoc<UserNavFields>(rawUserData);

    const response: ApiOwnUserNavResult = {
      success: true,
      data: user,
      metadata: {
        total: 1,
        page: 1,
        limit: 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error fetching user navigation",
    } satisfies ApiErrorResponse);
  }
}
