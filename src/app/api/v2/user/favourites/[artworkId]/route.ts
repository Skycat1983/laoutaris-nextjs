import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { getUserIdFromSession } from "@/lib/old_code/user/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { FrontendArtworkUnpopulated } from "@/lib/data/types/artworkTypes";
import { artworkToPublic } from "@/lib/transforms/artworkToPublic";

export async function GET(
  request: Request,
  { params }: { params: { artworkId: string } }
) {
  console.log("params", params);
  const userId = await getUserIdFromSession();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { artworkId } = params;

  const rawArtwork = await ArtworkModel.findById(artworkId).lean();

  // console.log("rawArtwork", rawArtwork);

  if (!rawArtwork) {
    return new Response("Artwork not found", { status: 404 });
  }

  const artwork = transformMongooseDoc<FrontendArtworkUnpopulated>(rawArtwork);

  // console.log("artwork in user/favourites/[artworkId]", artwork);

  // const isFavourited = artwork.favourited.includes(userId);
  const sanitizedArtwork = artworkToPublic(artwork, userId);

  // console.log(
  //   "sanitizedArtwork in user/favourites/[artworkId]",
  //   sanitizedArtwork
  // );

  return NextResponse.json({
    sanitizedArtwork,
  });
}
