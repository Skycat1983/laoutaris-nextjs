import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

// TODO: why are timestamps not being created? therefore we sort by displaydate instead
export async function GET(request: NextRequest) {
  try {
    const blogs = await BlogModel.find({})
      .sort({ displayDate: -1 })
      .limit(5)
      .lean()
      .exec();

    // console.log("blogs", blogs);

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
