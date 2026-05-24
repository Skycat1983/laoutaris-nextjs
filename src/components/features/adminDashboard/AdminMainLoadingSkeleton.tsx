import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { Skeleton } from "@/components/shadcn/skeleton";

const operationTabs = ["Create", "Read", "Update", "Delete"] as const;

export function AdminMainLoadingSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Admin dashboard section loading"
      className="flex flex-col p-4"
    >
      <div className="p-8 mt-8">
        <LoadingStatus
          label="Loading admin dashboard section"
          visibleLabel="Loading admin dashboard section"
          className="justify-start text-gray-700"
          iconClassName="text-gray-900"
        />
        <Skeleton className="mt-6 h-10 w-48" aria-hidden="true" />
      </div>

      <div className="px-8">
        <div
          className="mb-10 flex flex-row gap-10 border-greyish/50"
          aria-hidden="true"
        >
          {operationTabs.map((operation) => (
            <div key={operation} className="px-8 p-4">
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>

        <div className="space-y-5" aria-hidden="true">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </section>
  );
}
