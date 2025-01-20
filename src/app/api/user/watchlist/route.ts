import { UserModel } from "@/lib/server/models";
import { FrontendUserWithWatcherlist } from "@/lib/types/userTypes";
import dbConnect from "@/utils/mongodb";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();
    console.log("Database connected successfully.");

    const { searchParams } = new URL(req.url);
    const userKey = searchParams.get("userKey");
    const userValue = searchParams.get("userValue");
    const artworkId = searchParams.get("artworkId");
    const watchlistFieldsParam = searchParams.get("artworkFields");

    console.log(`Artwork ID: ${artworkId}`);

    // Validate presence of userKey, userValue, and artworkId
    if (!userKey || !userValue || !artworkId) {
      console.error("Missing userKey, userValue, or artworkId.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 400,
          message: "Missing userKey, userValue, or artworkId.",
        },
        { status: 400 }
      );
    }

    // Parse fields
    const watchlistFields = parseFields(watchlistFieldsParam);

    // Populate the specific artwork from watchlist
    const populatedUser = await UserModel.findOne({ [userKey]: userValue })
      .populate({
        path: "watchlist",
        match: { _id: artworkId },
        select: watchlistFields || "",
      })
      .lean<FrontendUserWithWatcherlist>();

    console.log("populatedUser :>> ", populatedUser);

    if (!populatedUser || !populatedUser.watchlist.length) {
      console.error("Artwork not found after population.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Artwork not found in watchlist after population.",
        },
        { status: 404 }
      );
    }

    const watchedArtwork = populatedUser.watchlist[0];

    return NextResponse.json({
      success: true,
      data: watchedArtwork,
    });
  } catch (error) {
    console.error("Error validating watchlist artwork:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
};
