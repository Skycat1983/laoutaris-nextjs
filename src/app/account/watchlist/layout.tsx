import { getUserWatchlistPaginationData } from "@/lib/server/user/use_cases/getUserWatchlistPaginationData";
import { Suspense } from "react";
import PaginationSkeleton from "@/unused/PaginationSkeleton";
import { Pagination } from "@/components/modules/pagination/CollectionViewPagination";

export default async function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getData = getUserWatchlistPaginationData;

  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <Pagination getData={getData} />
      </Suspense>
    </section>
  );
}
