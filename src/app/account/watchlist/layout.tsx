import { Suspense } from "react";
import PaginationSkeleton from "../../../../unused/PaginationSkeleton";
import { WatchlistPaginationLoader } from "@/components/loaders/componentLoaders/WatchlistPaginationLoader";

export default async function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <WatchlistPaginationLoader />
      </Suspense>
    </section>
  );
}
