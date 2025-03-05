import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import slugify from "slugify";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types";
import { CreateArticleResult } from "@/lib/api/admin/create/fetchers";
import { createArticleSchema } from "@/lib/data/schemas";

export async function POST(
  request: NextRequest
): Promise<ApiResponse<CreateArticleResult>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
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
    const validatedData = createArticleSchema.parse(body);

    // Create slug from title
    const slug = slugify(validatedData.title, { lower: true });

    // Combine the request body with additional data
    const articleData = {
      ...validatedData,
      slug,
      author: session.user.id,
    };

    const article = new ArticleModel(articleData);
    await article.save();

    return NextResponse.json({
      success: true,
      data: article,
    } satisfies CreateArticleResult);
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create article",
        error: "Failed to create article",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
