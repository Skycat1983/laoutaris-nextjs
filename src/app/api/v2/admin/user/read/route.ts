import { UserModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadUserListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import { UserLeanPopulated } from "@/lib/data/types";
import { transformUser } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";

// TODO: why are timestamps not being created? therefore we sort by displaydate instead
export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadUserListResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    await dbConnect();

    const total = await UserModel.countDocuments();

    const rawUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserLeanPopulated[]>();
    // .populate([ "author"]);

    if (rawUsers.length === 0) {
      return apiErrorResponse({
        message: "No users found",
        status: 404,
      });
    }

    const users = rawUsers.map((user) => transformUser.toFrontend(user));

    return apiListResponse(users, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("[USER_READ]", error);
    return apiErrorResponse({
      message: "Failed to fetch user(s)",
      status: 500,
    });
  }
}
