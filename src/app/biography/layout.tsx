import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { fetchBiographyFields } from "@/lib/server/biography/data-fetching/fetchBiographyFields";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";

type ArticleRedirectLink = Pick<IFrontendArticle, "title" | "slug">;

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "biography";

  const linksResult = await fetchBiographyFields<ArticleRedirectLink>(stem, [
    "title slug",
  ]);

  const { data } = linksResult.success ? linksResult : { data: [] };

  return (
    <section>
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}

// interface SubnavLink {
//   title: string;
//   slug: string;
// }

// export default async function BiographyLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await dbConnect();
//   const stem = "biography";

//   const linksResult = await fetchBiographyFields<SubnavLink>(stem, [
//     "title slug",
//   ]);

//   const { data } = linksResult.success ? linksResult : { data: [] };

//   return (
//     <section>
//       {data && <Subnav links={data} stem={stem} />}
//       {children}
//     </section>
//   );
// }
