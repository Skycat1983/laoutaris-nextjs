import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { fetchArtworkLinks } from "@/lib/server/artwork/data-fetching/fetchArtworkLinks";
import { fetchCollectionArtwork } from "@/lib/server/collection/data-fetching/fetchCollectionArtwork";
import dbConnect from "@/utils/mongodb";

export type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "medium">;
export type SelectedCollectionFields = Pick<
  IFrontendCollection,
  "artworks" | "slug" | "title"
>;
export type CollectionArtwork = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

export default async function CollectionLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const collectionKey = "slug";
  const collectionValue = params.collectionSlug;
  const collectionFields = ["slug", "title"];
  const artworkFields = ["medium", "image.pixelHeight", "image.pixelWidth"];
  const response = await fetchCollectionArtwork<CollectionArtwork>(
    collectionKey,
    collectionValue,
    collectionFields,
    artworkFields
  );

  if (response.success) {
    console.log(
      "response in collectionLayout",
      response.data.artworks[0].image
    );
  }

  return (
    <section className="">
      {children}
      {/* <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1>
      {artworkLinks && (
        <ServerPagination
          artworkLinks={artworkLinks}
          collectionSlug={params.collectionSlug}
        />
      )}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="flex flex-col w-full p-4 md:flex-row lg:px-24">
        <div className="flex flex-col">
          <h1 className="px-4 py-6 text-2xl font-bold">
            About this collection
          </h1>

          <p className="px-4 text-primary py-8">
            There are {artworkLinks && artworkLinks.length} pieces in this
            collection.
          </p>
        </div>

        <div className="px-4 py-8 md:hidden">
          <HorizontalDivider />
        </div>
        <div className="bg-slate-800/10 w-full flex flex-col w-full">
          <ArtistProfile />
        </div>
      </div>

      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4 w-full md:w-1/2 mx-auto">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div> */}
    </section>
  );
}

// const artworkLinksResult = await fetchArtworkLinks(params.collectionSlug);
// const artworkLinks = artworkLinksResult.success
//   ? artworkLinksResult.data
//   : null;

// console.log("artworkLinks in CollectionLayout", artworkLinks);
