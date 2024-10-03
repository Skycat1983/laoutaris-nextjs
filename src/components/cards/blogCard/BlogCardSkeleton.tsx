import SkeletonH1 from "@/components/atoms/skeletons/SkeletonH1";
import SkeletonH2 from "@/components/atoms/skeletons/SkeletonH2";
import SkeletonP from "@/components/atoms/skeletons/SkeletonP";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const BlogCardSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-3 py-8 w-full bg-green-100">
        <div className="col-span-1">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col h-full w-full text-left justify-center gap-3 pl-10">
            <SkeletonP />
            <SkeletonH1 />
            <SkeletonH2 />
            <div className="flex flex-row gap-8">
              <SkeletonP />
              <SkeletonP />
            </div>
            <SkeletonP />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCardSkeleton;

{
  /* <p className="font-archivo font-bold">Diary</p> */
}
{
  /* <h1 className="font-archivoBlack text-2xl">{title}</h1> */
}
{
  /* <p className="font-fancy text-xl">{subtitle}</p> */
}
{
  /* <p className="font-bold">By Heron Laoutaris</p> */
}
{
  /* <p className="text-gray-500">{formattedDate}</p> */
}
{
  /* <p className="font-fancy text-lg">{featuredText}</p> */
}
