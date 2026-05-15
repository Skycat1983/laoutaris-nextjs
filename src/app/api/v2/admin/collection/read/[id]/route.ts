import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadCollectionResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import {
  AdminCollectionTransformationsPopulated,
  AdminArtworkTransformations,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { transformCollectionPopulated } from "@/lib/transforms";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadCollectionResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("collection", "Invalid collection ID");
  }

  try {
    await dbConnect();

    const leanCollection = await CollectionModel.findById(id)
      .populate<{
        artworks: AdminArtworkTransformations["Lean"][];
      }>("artworks")
      .lean<AdminCollectionTransformationsPopulated["Lean"]>();

    if (!leanCollection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const collection: CollectionFrontendPopulated =
      transformCollectionPopulated(leanCollection);

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies ReadCollectionResult);
  } catch (error) {
    console.error("Error reading collection:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read collection",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
