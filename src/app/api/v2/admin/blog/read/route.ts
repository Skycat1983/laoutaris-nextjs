import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryFrontend,
} from "@/lib/data/types";
import { transformBlogPopulated } from "@/lib/transforms";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadBlogListResult>> {
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

    const total = await BlogModel.countDocuments();

    const rawBlogs = await BlogModel.find()
      .sort({ displayDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        author: AdminUserTransformations["Lean"];
        comments: AdminCommentTransformations["Lean"][];
      }>("author comments")
      .lean<AdminBlogTransformationsPopulated["Lean"][]>();

    if (rawBlogs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No blogs found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const blogs: BlogEntryFrontend[] = rawBlogs.map((blog) =>
      transformBlogPopulated(blog)
    );

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadBlogListResult);
  } catch (error) {
    console.error("[BLOG_READ]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
