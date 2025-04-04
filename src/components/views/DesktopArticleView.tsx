"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { Button } from "@/components/shadcn/button";
import { ArticleFrontendPopulated } from "@/lib/data/types/articleTypes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArticleProps {
  article: ArticleFrontendPopulated;
  nextArticle: string | null;
  prevArticle: string | null;
  form?: React.ReactNode;
}

const DesktopArticleView: React.FC<ArticleProps> = ({
  article,
  nextArticle,
  prevArticle,
  form,
}) => {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const title = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
  console.log("title", title);
  const paragraphs = article.text.replace(/\r\n/g, "\n").split(/\n\n+/);
  return (
    <>
      <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
          <div className="flex flex-col h-full justify-start items-start align-start">
            <Image
              src={article.artwork.image.secure_url}
              alt={article.title}
              width={article.artwork.image.pixelWidth}
              height={article.artwork.image.pixelHeight}
              className="my-bg h-full object-cover shadow-lg fade-in z-0"
            />
          </div>
        </div>
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full z-1 relative">
          <div className="flex flex-row w-full p-10 justify-end relative sticky top-[200px]">
            <div>
              <TransitionGroup
                appear={true}
                isShowing={true}
                textColour={article.overlayColour}
                title={article.title}
                subtitle={article.subtitle}
                author="30 March 2025"
              />
            </div>
          </div>
        </div>
        <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
          <h1 className="text-5xl font-bold font-cormorant">
            {title}
            {/* <span className="text-neutral-500">Joseph Laoutaris</span> */}
          </h1>
          {/* <h1 className="text-neutral-500 italic text-xl py-6 fontface-decorative">
            <span>{article.summary}</span>
          </h1> */}
          <h1 className="text-neutral-500 italic text-xl py-6">
            <span>{article.summary}</span>
          </h1>
          {/* Author info */}
          <div className="flex flex-row w-full justify-start items-center">
            <div className="h-16 w-16">
              <Image
                src="https://res.cloudinary.com/dzncmfirr/image/upload/v1723539243/user-images/heron_drr8t3.png"
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-start items-start ml-4">
              <h1 className="text-2xl font-bold font-cormorant">
                Heron Laoutaris
              </h1>
              <h2 className="text-neutral-500">Grandson</h2>
            </div>
          </div>
          <article className="prose-xl text-left fade-in">
            {/* Divider */}
            <div className="h-[2px] w-full bg-gray-500 my-10"></div>
            {/* Article text */}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`m-2 leading-8 prose-lg py-2 ${
                  index === 0 ? "drop-cap" : ""
                }`}
              >
                {paragraph.trim()}
              </p>
            ))}
          </article>
          {form && form}
          <div className="flex flex-row w-full justify-center items-center pt-[50px] gap-5">
            {prevArticle ? (
              <Link href={prevArticle} className="bg-black text-white w-full">
                <Button size={"full"}>Prev</Button>
              </Link>
            ) : (
              <Button size={"full"} variant={"ghost"}>
                Prev
              </Button>
            )}
            {nextArticle ? (
              <Link href={nextArticle} className="bg-black text-white w-full">
                <Button size={"full"}>Next</Button>
              </Link>
            ) : (
              <Button size={"full"} variant={"ghost"}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-10">
        <HorizontalDivider />
      </div>
    </>
  );
};

export { DesktopArticleView };
