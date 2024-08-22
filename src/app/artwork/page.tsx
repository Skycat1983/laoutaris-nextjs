import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";

export default async function Artwork() {
  await dbConnect();
  const stem = "artwork";

  const collectionLinks = await fetchCollectionLinks(stem);
  const { data: availableCollectionLinks } = collectionLinks.success
    ? collectionLinks
    : { data: [] };
  const defaultCollectionSublinkHref = `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].defaultRedirect}`;

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
