import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";

export default async function Biography() {
  await dbConnect();

  const stem = "biography";

  const linksResult = await fetchBiographyLinks(stem);

  const { data } = linksResult.success ? linksResult : { data: [] };

  if (data.length >= 0) {
    redirect(`/${stem}/${data[0].slug}`);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Biography Section</h1>
    </main>
  );
}
