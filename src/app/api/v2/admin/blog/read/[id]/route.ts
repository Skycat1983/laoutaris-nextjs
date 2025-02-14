import { BlogModel } from "@/lib/data/models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const blog = await BlogModel.findById(id)
      .populate(["author", "comments"])
      .lean()
      .exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error reading blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read blog" },
      { status: 500 }
    );
  }
}
