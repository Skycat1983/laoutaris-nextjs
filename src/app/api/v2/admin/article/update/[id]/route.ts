import { ArticleModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import slugify from "slugify";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get update data from request body
    const updateData = await request.json();

    // Generate new slug if title is being updated
    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true });
    }

    // Update the article
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      id,
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
