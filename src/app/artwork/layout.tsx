import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";
import { fetchCollectionFields } from "@/lib/server/collection/data-fetching/fetchCollectionFields";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";

type CollectionFields = Pick<IFrontendCollection, "title" | "slug">;

export default async function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const stem = "artwork";
  const response = await fetchCollectionFields<CollectionFields>(stem, [
    "title",
    "slug",
  ]);
  const { data } = response.success ? response : { data: [] };

  return (
    <section className="p-0 m-0">
      {data && <Subnav links={data} stem={stem} />}
      {children}
    </section>
  );
}

// interface CollectionLink {
//   title: string;
//   slug: string;
// }

// export default async function ArtworkLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await dbConnect();
//   const stem = "artwork";
//   const response = await fetchCollectionFields<CollectionLink>(stem, [
//     "title",
//     "slug",
//   ]);
//   const { data } = response.success ? response : { data: [] };

//   return (
//     <section className="p-0 m-0">
//       {data && <Subnav links={data} stem={stem} />}
//       {children}
//     </section>
//   );
// }

// ! old working code using fetchCollectionLinks
// const collectionLinksResult = await fetchCollectionLinks(stem);
// const { data } = collectionLinksResult.success
//   ? collectionLinksResult
//   : { data: [] };
