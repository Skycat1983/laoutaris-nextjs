import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import dbConnect from "@/utils/mongodb";

type BlogApiResponse = ApiResponse<FrontendBlogEntry[]>;
type SortByType = "latest" | "oldest" | "popular" | "featured";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<BlogApiResponse>> => {
  try {
    // Ensure DB connection
    await dbConnect();

    const { searchParams } = new URL(req.url);
    console.log("Search params:", Object.fromEntries(searchParams));

    // Check total blogs in collection first
    const totalBlogs = await BlogModel.countDocuments({});
    console.log("Total blogs in collection:", totalBlogs);

    // Build filter query object (separate from sort)
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

    // Try a simple find first to verify query works
    const simpleFind = await BlogModel.find({}).lean();
    console.log("Simple find count:", simpleFind.length);

    const [rawBlogs, total] = await Promise.all([
      BlogModel.find(filterQuery) // Use filter query here
        .sort(sortQuery) // Use sort query here
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      BlogModel.countDocuments(filterQuery), // Use same filter query for count
    ]);

    console.log("rawBlogs", rawBlogs);

    const blogs = transformMongooseDoc<FrontendBlogEntry[]>(rawBlogs);

    console.log("blogs transofrmed", blogs);

    const metadata: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata,
    } satisfies PaginatedResponse<FrontendBlogEntry[]>);
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
