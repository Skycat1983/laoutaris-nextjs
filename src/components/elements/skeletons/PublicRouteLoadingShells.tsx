import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { Skeleton } from "@/components/shadcn/skeleton";

const artworkSkeletonItems = [
  "h-72",
  "h-96",
  "h-64",
  "h-80",
  "h-[28rem]",
  "h-72",
  "h-96",
  "h-64",
  "h-80",
];

const searchSkeletonSections = [
  "Articles",
  "Blogs",
  "Collections",
  "Artworks",
] as const;

const FilterPanelSkeleton = () => (
  <aside
    className="hidden md:block fixed left-0 top-0 z-10 h-screen w-[300px] border-r border-gray-200 bg-white p-6 pt-24"
    aria-hidden="true"
  >
    <Skeleton className="mb-6 h-8 w-36" />
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  </aside>
);

export function ArtworkRouteLoadingShell() {
  return (
    <main aria-busy="true">
      <h1 className="sr-only">Artwork</h1>
      <div className="relative">
        <FilterPanelSkeleton />
        <div className="fixed bottom-4 right-4 z-50 md:hidden" aria-hidden="true">
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <section className="container mx-auto p-4 md:ml-[300px]">
          <LoadingStatus
            label="Loading artwork gallery"
            visibleLabel="Loading artwork gallery"
            className="mb-6 flex justify-start text-gray-700"
            iconClassName="text-gray-900"
          />
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {artworkSkeletonItems.map((heightClass, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <Skeleton className={`${heightClass} w-full rounded-none`} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const SearchResultCardSkeleton = () => (
  <div aria-hidden="true">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export function SearchRouteLoadingShell() {
  return (
    <main className="container mx-auto p-4" aria-busy="true">
      <h1 className="sr-only">Search Results</h1>
      <LoadingStatus
        label="Loading search results"
        visibleLabel="Loading search results"
        className="mb-4 flex justify-start text-gray-700"
        iconClassName="text-gray-900"
      />
      <Skeleton className="mb-8 h-8 w-64" aria-hidden="true" />
      <div className="grid gap-8">
        {searchSkeletonSections.map((section) => (
          <section key={section} className="mb-8" aria-hidden="true">
            <Skeleton className="mb-4 h-7 w-40" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SearchResultCardSkeleton key={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
