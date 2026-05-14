import "server-only";

import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { ArtworkFrontend, ArtworkLean } from "@/lib/data/types/artworkTypes";
import dbConnect from "@/lib/db/mongodb";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const isValidArtworkId = (artworkId: string): boolean => {
  return objectIdPattern.test(artworkId);
};

export const getArtworkById = async (
  artworkId: string,
  userId?: string | null
): Promise<ArtworkFrontend | null> => {
  if (!isValidArtworkId(artworkId)) {
    return null;
  }

  await dbConnect();

  const leanDoc = await ArtworkModel.findById(artworkId).lean<ArtworkLean>();
  if (!leanDoc) {
    return null;
  }

  return transformArtwork.toFrontend(leanDoc, userId);
};
