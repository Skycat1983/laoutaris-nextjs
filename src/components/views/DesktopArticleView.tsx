import TransitionGroup from "@/components/animations/TransitionGroup";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import { Button } from "@/components/ui/shadcn/button";
import { ArticleViewWithArtworkTooltip } from "@/lib/server/article/resolvers/articleToView";
import Image from "next/image";
import Link from "next/link";

interface ArticleProps {
  article: ArticleViewWithArtworkTooltip;
  nextArticle: string | null;
  prevArticle: string | null;
}

const DesktopArticleView: React.FC<ArticleProps> = ({
  article,
  nextArticle,
  prevArticle,
}) => {
  return (
    <>
      <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full z-1 relative">
          <div className="flex flex-row w-full p-10 justify-end relative sticky top-[200px]">
            <div>
              <TransitionGroup
                appear={true}
                isShowing={true}
                textColour={article.overlayColour}
                title={article.title}
                subtitle={article.subtitle}
                author="Heron Laoutaris"
              />
            </div>
          </div>
        </div>
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
          <div className="flex flex-col h-full justify-start items-start align-start">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={1920}
              height={1080}
              className="my-bg h-full object-cover shadow-lg fade-in"
            />
          </div>
        </div>
        <div className="col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
          <article className="prose-xl text-left fade-in">
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

export default DesktopArticleView;
