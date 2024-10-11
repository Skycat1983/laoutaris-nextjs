import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import { parseFields } from "@/utils/parseFields";
import { UserModel } from "@/lib/server/models";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { IFrontendUserPopulatedFavourites } from "@/lib/client/types/userTypes";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();
    console.log("Database connected successfully.");

    const { searchParams } = new URL(req.url);
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
      .lean<IFrontendUserPopulatedFavourites>();

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
      data: favouritedArtwork as IFrontendArtwork,
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

// // Find the user first
// const user = await UserModel.findOne({
//   [userKey]: userValue,
// }).lean<IFrontendUserPopulatedFavourites>();

// if (!user) {
//   console.error("User not found.");
//   return NextResponse.json(
//     {
//       success: false,
//       errorCode: 404,
//       message: "User not found.",
//     },
//     { status: 404 }
//   );
// }

// // Check if artworkId is in user's favourites
// const isArtworkInFavourites = user.favourites.some(
//   (fav: any) => fav.toString() === artworkId
// );

// console.log("user.favourites :>> ", user.favourites);
// console.log("isArtworkInFavourites :>> ", isArtworkInFavourites);

// if (!isArtworkInFavourites) {
//   console.error("Artwork not found in favourites.");
//   return NextResponse.json(
//     {
//       success: false,
//       errorCode: 404,
//       message: "Artwork not found in favourites.",
//     },
//     { status: 404 }
//   );
// }
