import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogListResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
// TODO: why are timestamps not being created? therefore we sort by displaydate instead

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadBlogListResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    const total = await BlogModel.countDocuments();

    const rawBlogs = await BlogModel.find()
      .sort({ displayDate: -1 })
      .skip(skip)
      .limit(limit);

    if (rawBlogs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No blogs found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const blogs = rawBlogs.map((blog) =>
      transformMongooseDoc<FrontendBlogEntry>(blog)
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

// export async function GET(request: NextRequest) {
//   try {
//     const { pathname, searchParams } = new URL(request.url);
//     const segments = pathname.split("/");
//     const id = segments[segments.length - 1];

//     // If no ID, return paginated list
//     if (id === "read") {
//       const limit = parseInt(searchParams.get("limit") || "10");
//       const page = parseInt(searchParams.get("page") || "1");
//       const skip = (page - 1) * limit;
//       const total = await BlogModel.countDocuments();

//       const blogs = await BlogModel.find()
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//       // .populate([ "author"]);

//       return NextResponse.json({
//         success: true,
//         data: blogs,
//         metadata: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       });
//     }

//     // If ID provided, return single item
//     const blog = await BlogModel.findById(id);

//     if (!blog) {
//       return NextResponse.json(
//         { success: false, error: "Blog not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: blog,
//     });
//   } catch (error) {
//     console.error("[BLOG_READ]", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch blog(s)" },
//       { status: 500 }
//     );
//   }
// }
