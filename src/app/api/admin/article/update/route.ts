import { ArticleModel } from "@/lib/server/models";
import { FrontendArticleUnpopulated } from "@/lib/types/articleTypes";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");

  if (!_id) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 400,
        message: "Missing article ID",
      },
      { status: 400 }
    );
  }

  try {
    // using Partial because all fields are optional
    const updatedData: Partial<FrontendArticleUnpopulated> = await req.json();

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      _id,
      updatedData,
      {
        new: true, // return the updated document
        runValidators: true, // run model validations to ensure schema conformity
      }
    ).lean(); // return a plain JS object instead of a Mongoose document

    if (!updatedArticle) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Article not found",
        },
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
      {
        success: false,
        errorCode: 500,
        message: "Failed to update article",
      },
      { status: 500 }
    );
  }
};
