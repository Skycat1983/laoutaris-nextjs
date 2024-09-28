"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useRef, useState } from "react";

interface ArticleProps {
  article: IFrontendArticle;
  // article: {
  //   title: string;
  //   subtitle: string;
  //   imageUrl: string;
  //   summary: string;
  //   text: string;
  //   overlayColour: string;
  // };
  nextUrl: string | null;
  prevUrl: string | null;
}

// TODO: fix the issue with
const MobileArticleView: React.FC<ArticleProps> = ({
  article,
  nextUrl,
  prevUrl,
}) => {
  const pathname = usePathname();
  console.log("pathname", pathname);
  const [overlayShowing, setOverlayShowing] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const getBackgroundPosition = () => {
    switch (pathname) {
      case "/biography/meeting-beryl":
        return "90% -100px";
      case "/biography/early-years":
        return "90% -0px";
      case "/biography/later-years":
        return "90% -100px";
      case "/biography/obituary":
        return "90% -400px";
      default:
        return "90% -100px";
    }
  };

  return (
    <>
      <div
        className="bg-cover  bg-fixed h-[530px] "
        style={{
          backgroundImage: `url(${article.artwork.image.secure_url})`,
          // backgroundPosition: "90% -100px",
          backgroundPosition: getBackgroundPosition(),
        }}
      >
        <div className="flex flex-row w-full h-[250px] p-[80px] justify-center relative sticky top-[120px]">
          {overlayShowing && (
            <TransitionGroup
              appear={true}
              isShowing={true}
              textColour={article.overlayColour}
              title={article.title}
              subtitle={article.subtitle}
              author="Heron Laoutaris" // TODO: Replace with actual author
            />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-start items-start bg-slate-100/50 relative bottom-[200px]">
        <article className="prose-xl text-left p-24 bg-white" ref={textRef}>
          {article.text.split("\r\n\r\n").map((paragraph, index) => (
            <p key={index} className="m-2 leading-8 prose-lg">
              {paragraph}
            </p>
          ))}
        </article>
      </div>

      <div className="flex flex-row w-full justify-center items-center px-[80px] gap-5">
        {prevUrl ? (
          <Link href={prevUrl} className="bg-black text-white w-full">
            <button className="bg-black text-white p-4 w-full">Previous</button>
          </Link>
        ) : (
          <button
            className="bg-gray-400 text-gray-600 p-4 w-full cursor-not-allowed"
            disabled
          >
            Previous
          </button>
        )}

        {nextUrl ? (
          <Link href={nextUrl} className="bg-black text-white w-full">
            <button className="bg-black text-white p-4 w-full">Next</button>
          </Link>
        ) : (
          <button
            className="bg-gray-400 text-gray-600 p-4 w-full cursor-not-allowed"
            disabled
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default MobileArticleView;
