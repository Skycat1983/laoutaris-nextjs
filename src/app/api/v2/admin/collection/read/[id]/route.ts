import { CollectionModel } from "@/lib/server/models";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const collection = await CollectionModel.findById(id)
      .populate("artworks")
      .lean()
      .exec();

    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    const transformedCollection = transformMongooseDoc(collection);

    return NextResponse.json({
      success: true,
      data: transformedCollection,
    });
  } catch (error) {
    console.error("Error reading collection:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read collection" },
      { status: 500 }
    );
  }
}
