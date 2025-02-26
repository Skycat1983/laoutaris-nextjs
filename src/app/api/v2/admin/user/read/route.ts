import { BlogModel, UserModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

// TODO: why are timestamps not being created? therefore we sort by displaydate instead
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    // If no ID, return paginated list
    if (id === "read") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const page = parseInt(searchParams.get("page") || "1");
      const skip = (page - 1) * limit;
      const total = await UserModel.countDocuments();

      const users = await UserModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      // .populate([ "author"]);

      return NextResponse.json({
        success: true,
        data: users,
        metadata: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // If ID provided, return single item
    const user = await UserModel.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("[BLOG_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user(s)" },
      { status: 500 }
    );
  }
}
