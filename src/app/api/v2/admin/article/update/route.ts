import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import slugify from "slugify";

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get article ID from query params
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Article ID is required" },
        { status: 400 }
      );
    }

    // Get update data from request body
    const updateData = await request.json();

    // Generate new slug if title is being updated
    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true });
    }

    // Update the article
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true } // Return the updated document
    ).populate(["artwork", "author"]);

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update article" },
      { status: 500 }
    );
  }
}
