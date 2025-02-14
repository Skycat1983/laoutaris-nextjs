import { CollectionModel } from "@/lib/data/models";
import { FrontendCollectionUnpopulated } from "@/lib/data/types/collectionTypes";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");

  if (!_id) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 400,
        message: "Missing collection ID",
      },
      { status: 400 }
    );
  }

  try {
    // using Partial because all fields are optional
    const updatedData: Partial<FrontendCollectionUnpopulated> =
      await req.json();

    const updatedCollection = await CollectionModel.findByIdAndUpdate(
      _id,
      updatedData,
      {
        new: true, // return the updated document
        runValidators: true, // run model validations to ensure schema conformity
      }
    ).lean(); // return a plain JS object instead of a Mongoose document

    if (!updatedCollection) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Collection not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCollection,
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Failed to update collection",
      },
      { status: 500 }
    );
  }
};
