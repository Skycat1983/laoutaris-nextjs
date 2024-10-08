import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFields";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";

type ArticleRedirectLink = Pick<IFrontendArticle, "slug">;

export default async function Biography() {
  await dbConnect();

  const stem = "biography";

  const linksResult = await fetchBiographyFields<ArticleRedirectLink>(stem, [
    "slug",
  ]);

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

// interface RedirectLink {
//   slug: string;
// }

// export default async function Biography() {
//   await dbConnect();

//   const stem = "biography";

//   const linksResult = await fetchBiographyFields<RedirectLink>(stem, ["slug"]);

//   const { data } = linksResult.success ? linksResult : { data: [] };

//   if (data.length >= 0) {
//     redirect(`/${stem}/${data[0].slug}`);
//   }
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>Biography Section</h1>
//     </main>
//   );
// }
