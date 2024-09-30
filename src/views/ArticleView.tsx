"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { useRef, useState } from "react";

interface ArticleProps {
  article: IFrontendArticle;
}

const ArticleView: React.FC<ArticleProps> = ({ article }) => {
  const [overlayShowing, setOverlayShowing] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  // TODO: change img to nextjs Image
  return (
    <>
      <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full z-1 relative">
          <div className="flex flex-row w-full p-10 justify-end relative sticky top-[200px]">
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
        </div>
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
          <div className="flex flex-col h-full justify-start items-start align-start">
            <img
              ref={imageRef}
              className="my-bg h-full object-cover w-full shadow-lg"
              src={article.imageUrl}
              onLoad={() => setOverlayShowing(true)}
            />
          </div>
        </div>
        <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
          <article className="prose-xl text-left" ref={textRef}>
            <h1 className="text-2xl font-bold font-archivoBlack my-5">
              {article.summary}
            </h1>
            <div className="h-[2px] w-full bg-gray-500 my-10"></div>
            {article.text.split("\r\n\r\n").map((paragraph, index) => (
              <p key={index} className="m-2 leading-8 prose-lg py-2">
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </div>
      <div className="p-10">
        <HorizontalDivider />
      </div>
    </>
  );
};

export default ArticleView;
