import { UserModel } from "@/lib/data/models";
import {
  UserNavFields,
  UserNavResponse,
} from "@/lib/data/types/navigationTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<UserNavResponse>> {
  const userId = await getUserIdFromSession();

  const rawUserData = await UserModel.findById(userId)
    .select("favourites watchlist comments")
    .lean()
    .exec();

  if (!rawUserData) {
    return NextResponse.json({
      success: false,
      error: "User not found",
    } satisfies ApiErrorResponse);
  }

  const user = transformMongooseDoc<UserNavFields>(rawUserData);

  const response: UserNavResponse = {
    success: true,
    data: user,
  };

  return NextResponse.json(response);
}
