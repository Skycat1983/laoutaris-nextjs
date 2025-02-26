import { BlogModel } from "@/lib/data/models";
import { createBlogFormSchema } from "@/lib/data/schemas";
import { FrontendBlogEntry } from "@/lib/data/types";
import { getAuthUser } from "@/lib/session/getAuthUser";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getAuthUser(request);

    console.log("user in blog create route", user);

    // The middleware already checked authentication,
    // but we double-check here for safety
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiErrorResponse,
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Admin access required",
        } satisfies ApiErrorResponse,
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createBlogFormSchema.parse(body);

    const slug = slugify(validatedData.title, { lower: true });

    const blogData = {
      ...validatedData,
      slug,
      author: user.id,
    };

    const blog = new BlogModel(blogData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies ApiSuccessResponse<FrontendBlogEntry>);
  } catch (error) {
    console.error("Error in blog create route:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
