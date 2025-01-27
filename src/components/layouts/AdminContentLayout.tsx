import { getArticleFeed } from "@/lib/server/admin/use_cases/getArticleFeed";
import { getArtworkFeed } from "@/lib/server/admin/use_cases/getArtworkFeed";

interface AdminContentLayoutProps {
  title: string;
  children: React.ReactNode;
  feedComponent: React.ReactNode;
}

export async function AdminContentLayout({
  title,
  children,
  feedComponent,
}: AdminContentLayoutProps) {
  console.log("title in admin content layout", title);
  const artworkFeed = await getArtworkFeed();
  const articleFeed = await getArticleFeed();
  console.log("artworkFeed", artworkFeed);
  console.log("articleFeed", articleFeed);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-orange-100">
      <div className="col-span-2 bg-greyish/10 hover:bg-whitish flex flex-col">
        <div className="flex flex-col p-4">
          <div className="flex flex-row">
            <h1 className="text-4xl font-archivo p-8 mt-8">{title}</h1>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block">{feedComponent}</div>
    </div>
  );
}
