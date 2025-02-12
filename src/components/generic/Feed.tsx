import { ReactNode } from "react";
import { RefreshButton } from "../admin/feeds/RefreshButton";

// Type for the fetch function that returns data
type FetchFn<T> = () => Promise<PaginatedResponse<T[]>>;

// Type for the card component
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

// Generic Feed component
export async function Feed<T>({
  fetchFn,
  CardComponent,
  title,
}: {
  fetchFn: FetchFn<T>;
  CardComponent: CardComponent<T>;
  title?: string;
}) {
  const { data } = await fetchFn();

  return (
    <FeedLayout title={title}>
      {data.map((item, index) => (
        <CardComponent key={index} item={item} />
      ))}
    </FeedLayout>
  );
}

// Loading state component
export function FeedSkeleton() {
  return (
    <FeedLayout>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full h-32 bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </FeedLayout>
  );
}
