"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
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

const MobileArticleView: React.FC<ArticleProps> = ({ article }) => {
  const [overlayShowing, setOverlayShowing] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="flex flex-col h-auto w-full justify-start items-start align-start">
        <img
          ref={imageRef}
          className="my-bg w-full h-auto object-cover shadow-lg"
          src={article.imageUrl}
          onLoad={() => setOverlayShowing(true)}
        />
      </div>

      <div className="flex flex-row w-full p-10 justify-center relative sticky bottom-[550px]">
        <div>
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
    </>
  );
};

export default MobileArticleView;

{
  /* <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start mx-[100px] mt-8">
          <article className="prose-xl text-left" ref={textRef}>
            <h1 className="text-2xl font-bold font-archivoBlack my-5">
              {article.summary}
            </h1>
            <div className="h-[2px] w-full bg-gray-500 my-10"></div>
            <p className="m-2 leading-8 prose-lg">{article.text}</p>
          </article>
        </div> */
}
