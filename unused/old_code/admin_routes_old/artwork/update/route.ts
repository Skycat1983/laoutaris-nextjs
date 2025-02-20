import { ArtworkModel } from "@/lib/data/models";
import { FrontendArtworkUnpopulated } from "@/lib/data/types/artworkTypes";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");

  if (!_id) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 400,
        message: "Missing artwork ID",
      },
      { status: 400 }
    );
  }

  try {
    // using Partial because all fields are optional
    const updatedData: Partial<FrontendArtworkUnpopulated> = await req.json();

    const updatedBlog = await ArtworkModel.findByIdAndUpdate(_id, updatedData, {
      new: true, // return the updated document
      runValidators: true, // run model validations to ensure schema conformity
    }).lean(); // return a plain JS object instead of a Mongoose document

    if (!updatedBlog) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Artwork not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Failed to update artwork",
      },
      { status: 500 }
    );
  }
};
