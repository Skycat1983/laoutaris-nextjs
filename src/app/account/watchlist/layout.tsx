import { Suspense } from "react";
import PaginationSkeleton from "../../../../unused/PaginationSkeleton";
import { UserWatchlistPaginationLoader } from "@/components/loaders/componentLoaders/UserWatchlistPaginationLoader";

export default async function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <UserWatchlistPaginationLoader />
      </Suspense>
    </section>
  );
}
