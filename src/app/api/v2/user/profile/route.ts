import { ApiProfileResult } from "@/lib/api/user/profile/fetchers";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiProfileResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(userGuard.userId).select("-password");

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
