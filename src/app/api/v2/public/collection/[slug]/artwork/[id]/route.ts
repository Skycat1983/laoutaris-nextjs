import { NextRequest } from "next/server";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { Types } from "mongoose";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string; id: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> {
  try {
    await dbConnect();

    const { slug, id } = params;

    // find collection and populate only the matching artwork
    const collection = await CollectionModel.findOne({ slug }).populate({
      path: "artworks",
      match: { _id: new Types.ObjectId(id) },
    });

    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    // check if artwork exists in this collection
    if (!collection.artworks?.length) {
      return apiErrorResponse({
        message: "Artwork not found in this collection",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      collection as ApiCollectionPopulatedResult["data"]
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching collection artwork:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection artwork",
      status: 500,
    });
  }
}
