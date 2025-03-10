import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadCollectionResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import {
  AdminCollectionTransformationsPopulated,
  AdminArtworkTransformations,
} from "@/lib/data/types";
import { transformAdminCollectionPopulated } from "@/lib/transforms/transformAdmin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadCollectionResult>> {
  const { id } = params;

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
  try {
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

    const collection: AdminCollectionTransformationsPopulated["Frontend"] =
      transformAdminCollectionPopulated(leanCollection);

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
