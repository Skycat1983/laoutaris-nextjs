"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useRef, useState } from "react";

interface ArticleProps {
  article: {
    title: string;
    subtitle: string;
    imageUrl: string;
    summary: string;
    text: string;
    overlayColour: string;
  };
}

// TODO: fix the issue with
const MobileArticleView: React.FC<ArticleProps> = ({ article }) => {
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
          backgroundImage: `url(${article.imageUrl})`,
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
        <article className="prose-xl text-left p-8 bg-white" ref={textRef}>
          <p className="m-2 leading-8 prose-lg">{article.text}</p>
        </article>
      </div>
    </>
  );
};

export default MobileArticleView;

{
  /* <div className="h-[400px] overflow-hidden">
        <div className="flex flex-col h-auto w-full justify-start items-center align-start bg-green-100">
          <img
            ref={imageRef}
            className="my-bg w-full h-auto object-cover shadow-lg fixed"
            src={article.imageUrl}
            onLoad={() => setOverlayShowing(true)}
          />
        </div>
      </div> */
}

{
  /* <div className="flex flex-row w-full h-[200px] p-10 justify-center relative sticky bottom-[550px]">
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
      </div> */
}

{
  /* {overlayShowing && (
          <TransitionGroup
            appear={true}
            isShowing={true}
            textColour={article.overlayColour}
            title={article.title}
            subtitle={article.subtitle}
            author="Heron Laoutaris" // TODO: Replace with actual author
          />
        )} */
}

{
  /* <div className="flex flex-col h-auto w-full justify-start items-start align-start bg-green-100">
        <img
          ref={imageRef}
          className="my-bg w-full h-auto object-cover shadow-lg"
          src={article.imageUrl}
          onLoad={() => setOverlayShowing(true)}
        />
      </div> */
}
