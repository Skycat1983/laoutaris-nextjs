import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { CollectionSelectFieldsLean, RouteResponse } from "@/lib/data/types";
import { ApiCollectionNavItemResult } from "@/lib/api/public/navigation/fetchers";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionNavItemResult>> => {
  const { slug } = params;

  try {
    await dbConnect();

    const collectionLean = await CollectionModel.findOne({
      section: "collections",
      slug,
    })
      .select("title slug artworks")
      .lean<CollectionSelectFieldsLean>(); //? add type to lean() ?

    if (!collectionLean) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    const collectionNavData = transformCollectionNav.toFrontend(collectionLean);

    return apiSuccessResponse<ApiCollectionNavItemResult["data"]>(
      collectionNavData
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching collection navigation:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection navigation",
      status: 500,
    });
  }
};
