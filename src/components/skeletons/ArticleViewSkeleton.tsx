import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const DesktopSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-7 grid-rows-1 w-full h-full">
        <div className="col-start-1 col-end-5 row-start-1 row-end-1 h-full place-start z-negative">
          <Skeleton className="flex flex-col h-full justify-start items-start align-start ml-10 mt-8 h-[1000px]" />
        </div>
        <div className="w-full col-start-5 col-end-8 row-start-1 row-end-1 flex flex-col justify-start items-start md:mx-[50px] lg:mx-[70px] xl:mx-[90px] mt-8">
          <Skeleton className="h-[40px] w-[390px] my-5 rounded-xl" />
          <Skeleton className="h-[2px] w-full my-6" />

          <div className="space-y-4 w-full">
            {[...Array(15)].map((_, index) => (
              <Skeleton key={index} className="m-2 h-4 w-3/4" />
            ))}
          </div>
          <div className="flex flex-row w-full justify-center items-center pt-[50px] gap-5">
            <Skeleton className="bg-black text-white w-full"></Skeleton>
            <Skeleton className="bg-black text-white w-full"></Skeleton>
          </div>
        </div>
      </div>
      <div className="p-10">
        <HorizontalDivider />
      </div>
    </>
  );
};

const MobileSkeleton = () => {
  return (
    <>
      <Skeleton className="w-full h-[530px] fade-in" />

      <div className="flex flex-col justify-start items-start bg-slate-100/50 relative bottom-[200px]">
        <article className="prose-xl text-left p-24 bg-white fade-in">
          {[...Array(15)].map((_, index) => (
            <Skeleton key={index} className="m-2 h-4 w-3/4" />
          ))}
        </article>
      </div>

      <div className="flex flex-row w-full justify-center items-center px-[80px] gap-5"></div>
    </>
  );
};

const ArticleViewSkeleton = () => {
  return (
    <>
      <main className="flex flex-col items-center justify-between lg:px-12 py-4">
        {/* Render MobileArticleView for mobile devices */}
        <div className="block md:hidden">
          <MobileSkeleton />
        </div>

        {/* Render ArticleView for desktop devices */}
        <div className="hidden md:block">
          <DesktopSkeleton />
        </div>
      </main>
    </>
  );
};

export default ArticleViewSkeleton;

{
  /* {prevUrl ? (
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
        )} */
}
