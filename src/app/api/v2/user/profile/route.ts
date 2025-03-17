import { ApiProfileResult } from "@/lib/api/user/profile/fetchers";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiProfileResult>> {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: user,
    } satisfies ApiProfileResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user",
    } satisfies ApiErrorResponse);
  }
}
