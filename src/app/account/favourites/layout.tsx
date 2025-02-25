import { FavouritesPaginationLoader } from "@/components/loaders/componentLoaders/FavouritesPaginationLoader";
import { PaginationSkeleton } from "@/components/modules/pagination/CollectionViewPagination";
import { Suspense } from "react";

export default async function FavouritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <FavouritesPaginationLoader />
      </Suspense>
    </section>
  );
}
