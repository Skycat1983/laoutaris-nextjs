import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

interface IFrontendArtworkPaginationLink {
  id: string;
  imageData: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

const transformToArtworkLink = (
  collection: IFrontendCollection
): IFrontendArtworkPaginationLink[] => {
  return collection.artworks.map((artwork) => ({
    id: artwork._id,
    imageData: {
      secure_url: artwork.image.secure_url,
      pixelHeight: artwork.image.pixelHeight,
      pixelWidth: artwork.image.pixelWidth,
    },
  }));
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const collectionSlug = searchParams.get("collectionSlug");

  try {
    const collection = (await CollectionModel.findOne({ slug: collectionSlug })
      .populate("artworks")
      .lean()) as IFrontendCollection;

    if (!collection) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Collection not found",
        },
        { status: 404 }
      );
    }

    console.log("collection in api/artwork/links:>> ", collection);

    const artworkLinks = transformToArtworkLink(collection);

    console.log("artworkLinks", artworkLinks);

    return NextResponse.json<
      ApiSuccessResponse<IFrontendArtworkPaginationLink[]>
    >({
      success: true,
      data: artworkLinks,
    });
  } catch (error) {
    console.error("Error fetching artwork links:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
