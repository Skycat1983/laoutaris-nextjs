import { CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types";
import { CollectionSelectFieldsLean, RouteResponse } from "@/lib/data/types";
import { ApiCollectionNavItemResult } from "@/lib/api/public/navigation/fetchers";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";
export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionNavItemResult>> => {
  const { slug } = params;

  try {
    const collectionLean = await CollectionModel.findOne({
      section: "collections",
      slug,
    })
      .select("title slug artworks")
      .lean<CollectionSelectFieldsLean>(); //? add type to lean() ?

    if (!collectionLean) {
      return NextResponse.json({
        success: false,
        error: "Collection not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const collectionNavData = transformCollectionNav.toFrontend(collectionLean);

    return NextResponse.json({
      success: true,
      data: collectionNavData,
    } satisfies ApiCollectionNavItemResult);
  } catch (error) {
    console.error("Error fetching collection navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};
