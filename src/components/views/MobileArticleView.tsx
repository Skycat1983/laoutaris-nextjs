"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import { ArticleViewWithArtworkTooltip } from "@/lib/resolvers/articleToView";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArticleProps {
  article: ArticleViewWithArtworkTooltip;
  nextUrl: string | null;
  prevUrl: string | null;
}

// i would like to make this more readable. let's focus on the prev and next buttons. perhaps instead of using ternary making the comp longer we might make a reusable component that wwill receive all that is necesary to function.

const MobileArticleView: React.FC<ArticleProps> = ({
  article,
  nextUrl,
  prevUrl,
}) => {
  const pathname = usePathname();

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
        className="bg-cover  bg-fixed h-[530px] fade-in"
        style={{
          backgroundImage: `url(${article.artwork.image.secure_url})`,
          // backgroundPosition: "90% -100px",
          backgroundPosition: getBackgroundPosition(),
        }}
      >
        <div className="flex flex-row w-full h-[250px] p-[80px] justify-center relative sticky top-[120px]">
          <TransitionGroup
            appear={true}
            isShowing={true}
            textColour={article.overlayColour}
            title={article.title}
            subtitle={article.subtitle}
            author="Heron Laoutaris" // TODO: Replace with actual author
          />
        </div>
      </div>

      <div className="flex flex-col justify-start items-start bg-slate-100/50 relative bottom-[200px]">
        <article className="prose-xl text-left p-24 bg-white fade-in">
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
