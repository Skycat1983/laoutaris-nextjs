import { BlogModel } from "@/lib/data/models";
import { createBlogFormSchema } from "@/lib/data/schemas";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types";
import { CreateBlogResult } from "@/lib/api/admin/create/fetchers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";

export async function POST(
  request: NextRequest
): Promise<ApiResponse<CreateBlogResult>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
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
      author: session.user.id,
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
