"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn/tabs";
import { ArticleFeed } from "./ArticleFeed";
import { Suspense, useRef } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { ArtworkFeed } from "./ArtworkFeed";
import { BlogFeed } from "./BlogFeed";
import { CollectionFeed } from "./CollectionFeed";
import { CommentFeed } from "./CommentFeed";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";

const baseTabClass =
  "text-lg font-archivo px-6 text-gray-400 data-[state=active]:text-black transition-colors whitespace-nowrap";

export function FeedTabs() {
  const tabsRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <Tabs defaultValue="articles" className="w-full">
        <div className="flex flex-row items-center pt-8 border-b-2">
          <Button
            size="icon"
            onClick={() => scroll("left")}
            className="px-2 bg-whitish rounded text-gray-400 outline-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="overflow-hidden" ref={tabsRef}>
            <TabsList className="bg-transparent flex-nowrap overflow-x-auto scrollbar-hide">
              <TabsTrigger value="articles" className={baseTabClass}>
                Articles
              </TabsTrigger>
              <TabsTrigger value="artwork" className={baseTabClass}>
                Artwork
              </TabsTrigger>
              <TabsTrigger value="blogs" className={baseTabClass}>
                Blogs
              </TabsTrigger>
              <TabsTrigger value="collections" className={baseTabClass}>
                Collections
              </TabsTrigger>
              <TabsTrigger value="comments" className={baseTabClass}>
                Comments
              </TabsTrigger>
            </TabsList>
          </div>

          <Button
            size="icon"
            onClick={() => scroll("right")}
            className="px-2 bg-whitish rounded text-gray-400 outline-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          <TabsContent value="articles">
            <Suspense fallback={<FeedSkeleton />}>
              <ArticleFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="artwork">
            <Suspense fallback={<FeedSkeleton />}>
              <ArtworkFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="blogs">
            <Suspense fallback={<FeedSkeleton />}>
              <BlogFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="collections">
            <Suspense fallback={<FeedSkeleton />}>
              <CollectionFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="comments">
            <Suspense fallback={<FeedSkeleton />}>
              <CommentFeed />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
