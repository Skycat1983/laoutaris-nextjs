import { RefreshButton } from "../admin/feeds/RefreshButton";

export async function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FeedLoader() {
  return <Feed cardComponent={<h1>Card</h1>} />;
}

export function Feed({ cardComponent }: { cardComponent: React.ReactNode }) {
  return (
    <FeedLayout>
      <h1></h1>
    </FeedLayout>
  );
}
