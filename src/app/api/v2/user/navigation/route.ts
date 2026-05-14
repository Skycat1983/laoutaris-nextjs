import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, Prettify, RouteResponse } from "@/lib/data/types";
import { OwnUserSelectFieldsLean } from "@/lib/data/types/navigationTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiOwnUserNavResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    await dbConnect();

    const leanUserData = await UserModel.findById(userGuard.userId)
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
    if (isNextError(error)) {
      // throw error;
      return NextResponse.json({
        success: false,
        error: "Next error triggered",
      } satisfies ApiErrorResponse);
    }
    return NextResponse.json({
      success: false,
      error: "Error fetching user navigation",
    } satisfies ApiErrorResponse);
  }
}
