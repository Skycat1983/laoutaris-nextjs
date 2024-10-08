import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";

type CollectionFields = Pick<IFrontendCollection, "title" | "slug">;

export default async function Collection({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const stem = "artwork";

  const response = await fetchCollectionFields<CollectionFields>(stem, [
    "title",
    "slug",
  ]);
  const { data: availableCollectionLinks } = response.success
    ? response
    : { data: [] };

  const defaultCollectionSublinkHref =
    availableCollectionLinks.length > 0
      ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].slug}`
      : null;

  if (defaultCollectionSublinkHref) {
    redirect(
      `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
      {/* {collection && (
        <CollectionView collection={collection} watchlist={watchlist} />
      )} */}
    </main>
  );
}

// interface CollectionLink {
//   title: string;
//   slug: string;
// }

// export default async function Collection({
//   params,
// }: {
//   params: { collectionSlug: string };
// }) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);

//   const stem = "artwork";

//   // Fetch collection fields using the new fetchCollectionFields function
//   const response = await fetchCollectionFields<CollectionLink>(stem, [
//     "title",
//     "slug",
//   ]);
//   const { data: availableCollectionLinks } = response.success
//     ? response
//     : { data: [] };

//   // Create the default sublink href
//   const defaultCollectionSublinkHref =
//     availableCollectionLinks.length > 0
//       ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].slug}`
//       : null;

//   // Redirect if the defaultCollectionSublinkHref exists
//   if (defaultCollectionSublinkHref) {
//     redirect(
//       `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
//     );
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
//       {/* {collection && (
//         <CollectionView collection={collection} watchlist={watchlist} />
//       )} */}
//     </main>
//   );
// }

//! old working code using fetchCollectionLinks
// export default async function Collection({
//   params,
// }: {
//   params: { collectionSlug: string };
// }) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);

//   const stem = "artwork";

//   const collectionLinks = await fetchCollectionLinks(stem);
//   const { data: availableCollectionLinks } = collectionLinks.success
//     ? collectionLinks
//     : { data: [] };
//   const defaultCollectionSublinkHref = `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].defaultRedirect}`;

//   if (defaultCollectionSublinkHref) {
//     redirect(
//       `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
//     );
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
//       {/* {collection && (
//         <CollectionView collection={collection} watchlist={watchlist} />
//       )} */}
//     </main>
//   );
// }
