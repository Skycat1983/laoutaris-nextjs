import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error("Error reading collection:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read collection" },
      { status: 500 }
    );
  }
}
