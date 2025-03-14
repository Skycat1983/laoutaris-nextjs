import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, Prettify, RouteResponse } from "@/lib/data/types";
import { OwnUserSelectFieldsLean } from "@/lib/data/types/navigationTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiOwnUserNavResult>> {
  const userId = await getUserIdFromSession();

  try {
    const leanUserData = await UserModel.findById(userId)
      .select("favourites watchlist comments")
      .lean<OwnUserSelectFieldsLean>();

    if (!leanUserData) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const userNavData: Prettify<
      ReturnType<typeof transformAccountNav.toFrontend>
    > = transformAccountNav.toFrontend(leanUserData);

    const response: ApiOwnUserNavResult = {
      success: true,
      data: userNavData,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error fetching user navigation",
    } satisfies ApiErrorResponse);
  }
}
