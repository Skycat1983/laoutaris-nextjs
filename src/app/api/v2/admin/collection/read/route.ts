import { CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import { ReadCollectionListResult } from "@/lib/api/admin/read/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { isAdmin } from "@/lib/session/isAdmin";
import {
  AdminArtworkTransformations,
  AdminCollectionTransformations,
  AdminCollectionTransformationsPopulated,
} from "@/lib/data/types";
import { transformAdminCollectionPopulated } from "@/lib/transforms/transformAdminCollection";

// TODO: remove the 'return one item' logic

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadCollectionListResult>> {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

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
    const total = await CollectionModel.countDocuments();

    const rawCollections = await CollectionModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        artworks: AdminArtworkTransformations["Lean"][];
      }>("artworks")
      .lean<Array<AdminCollectionTransformationsPopulated["Lean"]>>();

    if (rawCollections.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No collections found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const collections: AdminCollectionTransformationsPopulated["Frontend"][] =
      rawCollections.map((collection) =>
        transformAdminCollectionPopulated(collection)
      );

    return NextResponse.json({
      success: true,
      data: collections,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadCollectionListResult);
  } catch (error) {
    console.error("[ARTICLE_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article(s)" },
      { status: 500 }
    ) satisfies NextResponse<ApiErrorResponse>;
  }
}
