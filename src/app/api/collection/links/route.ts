import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

function transformToCollectionLink(doc: any): SubnavLink {
  return {
    title: doc.title,
    slug: doc.slug,
  };
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  try {
    const rawCollectionLinks = await CollectionModel.find({ section })
      .select("title slug")
      .lean();

    if (!rawCollectionLinks || rawCollectionLinks.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Collection not found",
        },
        { status: 404 }
      );
    }

    // Transform the raw data to match CollectionLink[]
    const collectionLinks: SubnavLink[] = rawCollectionLinks.map(
      transformToCollectionLink
    );

    return NextResponse.json<ApiSuccessResponse<SubnavLink[]>>({
      success: true,
      data: collectionLinks,
    });
  } catch (error) {
    console.error("Error fetching collection links:", error);
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

// export const GET = async (req: NextRequest): Promise<NextResponse> => {
//   const { searchParams } = new URL(req.url);
//   const section = searchParams.get("section");

//   try {
//     const rawCollectionLinks = await CollectionModel.find({ section })
//       .select("title slug")
//       .lean();

//     if (!rawCollectionLinks || rawCollectionLinks.length === 0) {
//       return NextResponse.json<ApiRouteResponse<null>>(
//         {
//           success: false,
//           errorCode: 404,
//           message: "Collection not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Transform the raw data to match CollectionLink[]
//     const collectionLinks: CollectionLink[] = rawCollectionLinks.map(
//       transformToCollectionLink
//     );

//     return NextResponse.json<ApiRouteResponse<CollectionLink[]>>({
//       success: true,
//       data: collectionLinks,
//     });
//   } catch (error) {
//     console.error("Error fetching collection links:", error);
//     return NextResponse.json<ApiRouteResponse<null>>(
//       {
//         success: false,
//         errorCode: 500,
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// };

// export const GET2 = async (req: NextRequest) => {
//   const { searchParams } = new URL(req.url);
//   const section = searchParams.get("section");
//   console.log("getting section content for", section);
//   try {
//     const collectionLinks = await CollectionModel.find({ section: section })
//       .select("title slug")
//       .lean();

//     if (!collectionLinks) {
//       return {
//         errorCode: 404,
//         json: { message: "Collection not found" },
//       };
//     }
//     return collectionLinks;
//   } catch (error) {
//     console.log("error :>> ", error);
//     return null;
//   }
// };
