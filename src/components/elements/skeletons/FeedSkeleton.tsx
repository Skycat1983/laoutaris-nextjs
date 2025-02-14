import { Skeleton } from "../../shadcn/skeleton";

export async function FeedSkeleton() {
  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {Array(5)
            .fill(null)
            .map((_, i) => {
              return <Skeleton key={i} className="w-[250px] h-[300px]" />;
            })}
        </div>
      </div>
    </div>
  );
}
