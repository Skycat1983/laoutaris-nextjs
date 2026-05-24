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

const shopProductSkeletonItems = Array.from({ length: 6 });

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

const ShopFiltersSkeleton = () => (
  <div className="w-full bg-white px-8 py-8" aria-hidden="true">
    <div className="mx-auto max-w-7xl">
      <Skeleton className="mb-6 h-5 w-24" />
      <div className="mb-6 flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-[160px] rounded-none" />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-none" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ShopProductCardSkeleton = () => (
  <article aria-hidden="true" className="text-center">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="py-8">
      <Skeleton className="mx-auto h-px w-24 rounded-none" />
    </div>
    <div className="space-y-3 p-4">
      <Skeleton className="mx-auto h-6 w-3/4" />
      <Skeleton className="mx-auto h-4 w-full" />
      <Skeleton className="mx-auto h-4 w-2/3" />
      <Skeleton className="mx-auto h-4 w-24" />
    </div>
  </article>
);

export function ShopProductsRouteLoadingShell() {
  return (
    <main
      className="flex min-h-screen max-w-screen flex-col items-center justify-start"
      aria-busy="true"
    >
      <div className="w-full max-w-7xl">
        <section className="mb-16 grid grid-cols-1 gap-0 lg:grid-cols-2">
          <Skeleton
            className="h-[400px] w-full rounded-none lg:h-[600px]"
            aria-hidden="true"
          />
          <div className="flex flex-col justify-center bg-gray-50 px-8 py-12 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <h1 className="mb-4 text-5xl text-gray-900 lg:text-6xl">
                Art for Sale
              </h1>
              <div className="mb-8 h-1 w-24 bg-gray-900" aria-hidden="true" />
              <Skeleton className="mb-6 h-8 w-72" aria-hidden="true" />
              <div className="space-y-3" aria-hidden="true">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </section>

        <LoadingStatus
          label="Loading shop products"
          visibleLabel="Loading shop products"
          className="px-8 text-gray-700"
          iconClassName="text-gray-900"
        />

        <ShopFiltersSkeleton />

        <div
          className="w-full border-t border-gray-200 bg-white px-8 py-6"
          aria-hidden="true"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-[180px] rounded-none" />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-10 px-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {shopProductSkeletonItems.map((_, index) => (
            <ShopProductCardSkeleton key={index} />
          ))}
        </section>
      </div>
    </main>
  );
}
