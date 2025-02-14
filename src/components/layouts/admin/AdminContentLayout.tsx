"use client";

import { getArticleFeed } from "@/useful_unused/use_cases/getArticleFeed";
import { getArtworkFeed } from "@/useful_unused/use_cases/getArtworkFeed";

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
  // console.log("title in admin content layout", title);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-200/20">
      <div className="col-span-2 bg-greyish/10 hover:bg-whitish flex flex-col">
        <div className="flex flex-col p-4">
          <div className="flex flex-row">
            <h1 className="text-4xl font-archivo font-semibold p-8 mt-8">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
      <div className="">{feedComponent}</div>
    </div>
  );
}
