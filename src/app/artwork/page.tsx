import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";

interface CollectionLink {
  title: string;
  slug: string;
}

export default async function Artwork() {
  await dbConnect();
  const stem = "artwork";

  // Fetching the collection fields using the new function
  const response = await fetchCollectionFields<CollectionLink>(stem, [
    "title",
    "slug",
  ]);
  const { data: availableCollectionLinks } = response.success
    ? response
    : { data: [] };

  // Create a default link if availableCollectionLinks has entries
  const defaultCollectionSublinkHref =
    availableCollectionLinks.length > 0
      ? `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].slug}`
      : null;

  // Redirect if we have a default link
  if (defaultCollectionSublinkHref) {
    redirect(
      `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>artwork</h1>
    </main>
  );
}
//! old working code using fetchCollectionLinks
// export default async function Artwork() {
//   await dbConnect();
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
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>artwork</h1>
//     </main>
//   );
// }
