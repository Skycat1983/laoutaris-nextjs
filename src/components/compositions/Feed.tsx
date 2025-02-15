import { ReactNode } from "react";
import { RefreshButton } from "@/components/elements/buttons/RefreshButton";
import { SkeletonFactory } from "./SkeletonFactory";
import { Skeleton } from "../shadcn/skeleton";

// type for the fetch function that returns data
type FetchFn<T> = (params: {
  page: number;
  limit: number;
}) => Promise<PaginatedResponse<T[]>>;

// type for the card component
type CardComponent<T> = React.ComponentType<{ item: T }>;

const FeedLayout = ({
  children,
  title = "Feed",
}: {
  children: ReactNode;
  title?: string;
}) => {
  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">{title}</h1>
        <RefreshButton />
      </div>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {children}
        </div>
      </div>
    </div>
  );
};

// generic Feed component
export async function Feed<T>({
  fetchFn,
  CardComponent,
  title,
  page = 1,
}: {
  fetchFn: FetchFn<T>;
  CardComponent: CardComponent<T>;
  title?: string;
  page?: number;
}) {
  const { data } = await fetchFn({ page, limit: 10 });

  return (
    <FeedLayout title={title}>
      {data.map((item, index) => (
        <CardComponent key={index} item={item} />
      ))}
    </FeedLayout>
  );
}

export function FeedCardSkeleton() {
  return <Skeleton className="w-[300px] h-[400px] bg-gray-200 " />;
}

// loading state component
export function FeedSkeleton() {
  return (
    <>
      <SkeletonFactory Layout={FeedLayout} Card={FeedCardSkeleton} count={3} />
    </>
  );
}
