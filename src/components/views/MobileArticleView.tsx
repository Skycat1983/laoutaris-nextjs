"use client";

import TransitionGroup from "@/components/animations/TransitionGroup";
import { ArticleFrontendPopulated } from "@/lib/data/types/articleTypes";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArticleProps {
  article: ArticleFrontendPopulated;
  nextUrl: string | null;
  prevUrl: string | null;
}

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

  // Determine overlay styles based on overlay color
  const overlayStyles =
    article.overlayColour === "white"
      ? {
          container: "bg-black/30",
          text: "text-white/90",
        }
      : {
          container: "bg-white/30",
          text: "text-black/90",
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
          {article.text
            .replace(/\r\n/g, "\n") // Normalize to \n
            .split(/\n\n+/) // Split on blank lines
            .map((paragraph, index) => (
              <p
                key={index}
                className={`leading-8 prose-lg mb-6 ${
                  index === 0 ? "drop-cap" : ""
                }`}
              >
                {paragraph.trim()}
              </p>
            ))}
        </article>
        {/* INSERT HERE */}
        <div
          className="w-full bg-cover bg-fixed h-[400px] fade-in"
          style={{
            backgroundImage: `url(${article.artwork.image.secure_url})`,
            backgroundPosition: "50% 50%",
          }}
        >
          {/* Overlay text container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`text-center p-8 ${overlayStyles.container} backdrop-blur-sm w-full m-16`}
            >
              <p className={`${overlayStyles.text} text-xl italic`}>
                `Here we will add a quote from the article. The quote should
                ideally come from the center of the article. Perhaps it can
                scroll into view parallax style.`
              </p>
            </div>
          </div>
        </div>

        <article className="prose-xl text-left p-24 bg-white fade-in">
          {article.text
            .replace(/\r\n/g, "\n") // Normalize to \n
            .split(/\n\n+/) // Split on blank lines
            .map((paragraph, index) => (
              <p
                key={index}
                className={`leading-8 prose-lg mb-6 ${
                  index === 0 ? "drop-cap" : ""
                }`}
              >
                {paragraph.trim()}
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

export { MobileArticleView };
