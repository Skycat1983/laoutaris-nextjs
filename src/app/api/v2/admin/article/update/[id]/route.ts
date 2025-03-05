import { ArticleModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateArticleResult } from "@/lib/api/admin/update/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateArticleResult>> {
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

  const { id } = params;
  try {
    const updateData = await request.json();

    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // return  updated doc
    );

    if (!updatedArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
          error: "Article not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle,
    } satisfies UpdateArticleResult);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update article",
        error: "Failed to update article",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
