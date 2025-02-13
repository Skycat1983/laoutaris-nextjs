import { BlogFeedCard } from "../../ui/cards/BlogFeedCard";
import { fetchBlogFeed } from "@/lib/api/feedApi";
import { Feed } from "@/components/generic/Feed";
import { FrontendBlogEntry } from "@/lib/types/blogTypes";

export function BlogFeed() {
  return (
    <Feed<FrontendBlogEntry>
      fetchFn={fetchBlogFeed}
      CardComponent={BlogFeedCard}
      title="Blog Feed"
    />
  );
}
