// ! Unused

import {
  ArticleFeed,
  CollectionFeed,
  ArtworkFeed,
  BlogFeed,
} from "@/components/features/adminDashboard/feeds";

//? could be used if we go baack to generating feed components again instead of hardcoding them
type FeedConfig = {
  key: "articles" | "collections" | "artwork" | "blog";
  title: string;
  component: React.ComponentType<{ page?: number }>;
  defaultFor: string[];
};

export const FEED_CONFIGS: FeedConfig[] = [
  {
    key: "articles",
    title: "Article Feed",
    component: ArticleFeed,
    defaultFor: ["/admin/articles"],
  },
  {
    key: "collections",
    title: "Collection Feed",
    component: CollectionFeed,
    defaultFor: ["/admin/collections"],
  },
  {
    key: "artwork",
    title: "Artwork Feed",
    component: ArtworkFeed,
    defaultFor: ["/admin/artwork"],
  },
  {
    key: "blog",
    title: "Blog Feed",
    component: BlogFeed,
    defaultFor: ["/admin/blog"],
  },
];
