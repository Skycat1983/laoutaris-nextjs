import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import { RefreshButton } from "./RefreshButton";
import { getBlogFeed } from "@/lib/server/admin/use_cases/getBlogFeed";
import { BlogFeedCard } from "./BlogFeedCard";
import { delay } from "@/utils/debug";

export async function BlogFeed() {
  await delay(2000);
  const blogFeed: FrontendBlogEntryUnpopulated[] = await getBlogFeed();

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {blogFeed.map((blog, i) => (
            <BlogFeedCard blog={blog} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
