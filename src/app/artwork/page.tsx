import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";

export default async function Artwork() {
  await dbConnect();
  const stem = "artwork";

  const linksResult = await fetchCollectionLinks(stem);

  const { data } = linksResult.success ? linksResult : { data: [] };

  if (data.length >= 0) {
    redirect(`/${stem}/${data[0].slug}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>artwork</h1>
    </main>
  );
}
