import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import { parseFields } from "@/utils/parseFields";
import { UserModel } from "@/lib/server/models";
import { FrontendUserWithFavourites } from "@/lib/types/userTypes";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);

  try {
    await dbConnect();

    const userKey = searchParams.get("userKey");
    const userValue = searchParams.get("userValue");
    const artworkId = searchParams.get("artworkId");
    const favouritesFieldsParam = searchParams.get("artworkFields");

    console.log(artworkId);

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
    const favouritesFields = parseFields(favouritesFieldsParam);

    // Populate the specific artwork from favourites
    const populatedUser = await UserModel.findOne({ [userKey]: userValue })
      .populate({
        path: "favourites",
        match: { _id: artworkId },
        select: favouritesFields || "",
      })
      .lean<FrontendUserWithFavourites>();

    console.log("populatedUser :>> ", populatedUser);

    if (!populatedUser || !populatedUser.favourites.length) {
      console.error("Artwork not found after population.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Artwork not found in favourites after population.",
        },
        { status: 404 }
      );
    }

    const favouritedArtwork = populatedUser.favourites[0];

    return NextResponse.json({
      success: true,
      data: favouritedArtwork,
    });
  } catch (error) {
    console.error("Error validating favourites artwork:", error);
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
