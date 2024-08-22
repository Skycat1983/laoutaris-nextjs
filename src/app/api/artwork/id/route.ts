import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { ArtworkModel } from "@/lib/server/models";
import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/server/user/session/getUserIdFromSession";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 400,
        message: "id parameter is missing",
      },
      { status: 400 }
    );
  }

  try {
    const rawContent = (await ArtworkModel.findOne({
      _id: id,
    }).lean()) as IFrontendArtwork;

    if (!rawContent) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Artwork not found",
        },
        { status: 404 }
      );
    }

    const userId = await getUserIdFromSession();

    if (userId) {
      rawContent.watcherlist = rawContent.watcherlist.filter(
        (id) => id !== userId
      );
      rawContent.favourited = rawContent.favourited.filter(
        (id) => id !== userId
      );
    } else {
      rawContent.watcherlist = [];
      rawContent.favourited = [];
    }

    return NextResponse.json<ApiSuccessResponse<IFrontendArtwork>>({
      success: true,
      data: rawContent,
    });
  } catch (error) {
    console.error("Error fetching article", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
