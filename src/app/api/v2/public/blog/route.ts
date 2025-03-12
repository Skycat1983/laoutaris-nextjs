import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import dbConnect from "@/lib/db/mongodb";
import { ApiBlogListResult } from "@/lib/api/public/blog/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { BlogEntryFrontend, BlogEntryLean } from "@/lib/data/types/blogTypes";
import { transformBlog } from "@/lib/transforms/transformBlog";
type SortByType = "latest" | "oldest" | "popular" | "featured";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiBlogListResult>> => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  try {
    const totalBlogs = await BlogModel.countDocuments({});

    const filterQuery: any = {};
    const sortQuery: any = {};

    const sortby = (searchParams.get("sortby") as SortByType) || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Apply sorting (separate from filter)
    switch (sortby) {
      case "latest":
        sortQuery.displayDate = -1;
        break;
      case "oldest":
        sortQuery.displayDate = 1;
        break;
      case "popular":
        sortQuery.comments = -1;
        break;
      case "featured":
        filterQuery.featured = true; // This goes in filter
        sortQuery.displayDate = -1;
        break;
      default:
        return NextResponse.json({
          success: false,
          error: "Invalid sortby parameter",
          statusCode: 400,
        } satisfies ApiErrorResponse);
    }

    console.log("MongoDB query:", {
      filter: filterQuery,
      sort: sortQuery,
      skip: (page - 1) * limit,
      limit,
    });

    const [rawBlogs, total] = await Promise.all([
      BlogModel.find(filterQuery) // Use filter query here
        .sort(sortQuery) // Use sort query here
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<BlogEntryLean[]>(),
      BlogModel.countDocuments(filterQuery), // Use same filter query for count
    ]);

    const blogs = rawBlogs.map((blog) => transformBlog.toFrontend(blog));

    const metadata = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata,
    } satisfies ApiBlogListResult);
  } catch (error) {
    console.error("Blog fetch error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entries",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};
