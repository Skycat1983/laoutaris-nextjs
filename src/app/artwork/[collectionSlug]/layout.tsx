import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { fetchArtworkLinks } from "@/lib/server/artwork/data-fetching/fetchArtworkLinks";
import dbConnect from "@/utils/mongodb";

export default async function CollectionLayout({
  params,

  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const artworkLinksResult = await fetchArtworkLinks(params.collectionSlug);
  const artworkLinks = artworkLinksResult.success
    ? artworkLinksResult.data
    : null;

  return (
    <section className="">
      {children}
      <div className="px-4 py-8">
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
          {artworkLinks && (
            <p className="px-4 text-primary">{/* {artworkLinks.text} */}</p>
          )}

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
        {/* <HorizontalDivider /> */}
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
    </section>
  );
}
