import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";

type CollectionFields = Pick<IFrontendCollection, "title" | "slug">;

export default async function Artwork() {
  await dbConnect();
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
    // redirect(
    //   `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
    // );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>artwork</h1>
    </main>
  );
}

// interface CollectionLink {
//   title: string;
//   slug: string;
// }

// export default async function Artwork() {
//   await dbConnect();
//   const stem = "artwork";

//   // Fetching the collection fields using the new function
//   const response = await fetchCollectionFields<CollectionLink>(stem, [
//     "title",
//     "slug",
//   ]);
//   const { data: availableCollectionLinks } = response.success
//     ? response
//     : { data: [] };

//   // Create a default link if availableCollectionLinks has entries
//   const defaultCollectionSublinkHref =
//     availableCollectionLinks.length > 0
//       ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].slug}`
//       : null;

//   // Redirect if we have a default link
//   if (defaultCollectionSublinkHref) {
//     redirect(
//       `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
//     );
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>artwork</h1>
//     </main>
//   );
// }
