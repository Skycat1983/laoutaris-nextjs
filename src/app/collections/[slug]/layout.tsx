import dbConnect from "@/lib/db/mongodb";
import { Suspense } from "react";
import { PaginationSkeleton } from "@/components/modules/pagination/CollectionViewPagination";
import { CollectionArtworksPaginationLoader } from "@/components/loaders/componentLoaders/CollectionArtworksPaginationLoader";

export default async function CollectionSlugLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  await dbConnect();
  const { slug } = params;

  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <CollectionArtworksPaginationLoader slug={slug} />
      </Suspense>
    </section>
  );
}
