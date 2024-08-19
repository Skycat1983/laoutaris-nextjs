import HorizontalDivider from "@/components/atoms/HorizontalDivider";
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
  console.log("collectionSlug", params.collectionSlug);
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
      <h1 className="px-4 py-6 text-2xl font-bold">About this collection</h1>
      <p className="px-4 text-primary">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est quo eius
        ipsa exercitationem deleniti eligendi sint nisi consequatur quaerat ut.
        Nesciunt quaerat aliquam nobis alias libero repellendus ducimus. Ea
        dolores aliquam soluta dolorem voluptatibus quasi impedit minus, beatae
        quaerat id dignissimos veritatis, nemo laborum, vel molestiae et fuga
        libero ab?
      </p>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
    </section>
  );
}
