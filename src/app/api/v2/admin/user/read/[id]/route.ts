import { NextRequest, NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadUserResult } from "@/lib/api/admin/read/fetchers";
import type { UserLean, UserFrontend } from "@/lib/data/types";
import { transformUser } from "@/lib/transforms";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadUserResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("user", "Invalid user ID");
  }

  try {
    await dbConnect();

    const leanUser = await UserModel.findById(id).lean<UserLean>();

    if (!leanUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const user: UserFrontend = transformUser.toFrontend(leanUser);

    return NextResponse.json({
      success: true,
      data: user,
    } satisfies ReadUserResult);
  } catch (error) {
    console.error("Error reading user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read user",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
