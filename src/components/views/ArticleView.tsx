import React from "react";
import MobileArticleView from "./MobileArticleView";
import DesktopArticleView from "./DesktopArticleView";
import { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";

interface ArticleViewProps {
  article: FrontendArticleWithArtwork;
  navigation: {
    prev: string | null;
    next: string | null;
  };
}

export function ArticleView({ article, navigation }: ArticleViewProps) {
  const { prev, next } = navigation;
  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      <div className="block md:hidden">
        <MobileArticleView article={article} nextUrl={next} prevUrl={prev} />
      </div>

      <div className="hidden md:block">
        <DesktopArticleView
          article={article}
          nextArticle={next}
          prevArticle={prev}
        />
      </div>
    </main>
  );
}

export default ArticleView;
