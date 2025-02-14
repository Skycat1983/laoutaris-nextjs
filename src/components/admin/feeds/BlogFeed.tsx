import { BlogFeedCard } from "../../modules/cards/BlogFeedCard";
import { fetchBlogFeed } from "@/lib/api/admin/feedApi";
import { Feed } from "@/components/compositions/Feed";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";

export function BlogFeed() {
  return (
    <Feed<FrontendBlogEntry>
      fetchFn={fetchBlogFeed}
      CardComponent={BlogFeedCard}
      title="Blog Feed"
    />
  );
}
