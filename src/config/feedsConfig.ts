import { ArticleFeed } from "@/components/admin/feeds/ArticleFeed";
import { ArtworkFeed } from "@/components/admin/feeds/ArtworkFeed";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CollectionFeed } from "@/components/admin/feeds/CollectionFeed";

export type FeedConfig = {
  key: "articles" | "collections" | "artworks" | "blog";
  title: string;
  component: React.ComponentType;
  defaultFor?: string[];
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
    key: "artworks",
    title: "Artwork Feed",
    component: ArtworkFeed,
    defaultFor: ["/admin/artworks"],
  },
  {
    key: "blog",
    title: "Blog Feed",
    component: BlogFeed,
    defaultFor: ["/admin/blog"],
  },
];
