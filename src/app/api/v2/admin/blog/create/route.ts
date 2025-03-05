import { BlogModel } from "@/lib/data/models";
import { createBlogFormSchema } from "@/lib/data/schemas";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateBlogResult } from "@/lib/api/admin/create/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function POST(
  request: NextRequest
): Promise<RouteResponse<CreateBlogResult>> {
  const hasPermission = await isAdmin();
  const userId = await getUserIdFromSession();
  if (!hasPermission || !userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const validatedData = createBlogFormSchema.parse(body);

    const slug = slugify(validatedData.title, { lower: true });

    const blogData = {
      ...validatedData,
      slug,
      author: userId,
    };

    const blog = new BlogModel(blogData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies CreateBlogResult);
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
