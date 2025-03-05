import { UserModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { ReadUserListResult } from "@/lib/api/admin/read/fetchers";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { FrontendUser } from "@/lib/data/types";

// TODO: why are timestamps not being created? therefore we sort by displaydate instead
export async function GET(
  request: NextRequest
): Promise<ApiResponse<ReadUserListResult>> {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    const total = await UserModel.countDocuments();

    const rawUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // .populate([ "author"]);

    if (rawUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No users found" } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const users = rawUsers.map((user) =>
      transformMongooseDoc<FrontendUser>(user)
    );

    return NextResponse.json({
      success: true,
      data: users,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadUserListResult);
  } catch (error) {
    console.error("[USER_READ]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user(s)",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
