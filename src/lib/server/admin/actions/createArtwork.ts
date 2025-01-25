import { ArtworkModel } from "@/lib/server/models/artworkModel";
import type { DBArtwork } from "@/lib/server/models/artworkModel";

export async function createArtwork(artworkData: Partial<DBArtwork>) {
  try {
    const newArtwork = new ArtworkModel(artworkData);
    await newArtwork.save();
    return { success: true, artwork: newArtwork };
  } catch (error) {
    console.error("Error creating artwork:", error);
    return { success: false, error: "Failed to create artwork" };
  }
}
