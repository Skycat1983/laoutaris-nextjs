import { ArtworkModel, CollectionModel } from "../data/models";

export async function syncCollectionReferences() {
  try {
    // Get all collections with their artworks
    const collections = await CollectionModel.find({}).select("_id artworks");

    console.log(`Found ${collections.length} collections to process`);

    // For each collection
    for (const collection of collections) {
      console.log(
        `Processing collection ${collection._id} with ${collection.artworks.length} artworks`
      );

      // Update all artworks that belong to this collection
      const updateResult = await ArtworkModel.updateMany(
        { _id: { $in: collection.artworks } },
        {
          $addToSet: { collections: collection._id }, // $addToSet prevents duplicates
        }
      );

      console.log(
        `Updated ${updateResult.modifiedCount} artworks for collection ${collection._id}`
      );
    }

    console.log("Finished syncing collection references");
  } catch (error) {
    console.error("Error syncing collection references:", error);
  }
}
