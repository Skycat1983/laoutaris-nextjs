import HorizontalDivider from "../components/ui/common/HorizontalDivider";
import SkeletonH1 from "../components/skeletons/SkeletonH1";
import SkeletonH2 from "../components/skeletons/SkeletonH2";
import SkeletonP from "../components/skeletons/SkeletonP";
import { Skeleton } from "../components/ui/shadcn/skeleton";

const BlogViewSkeleton = () => {
  const array = Array(6);
  return (
    <main className="flex min-h-screen flex-col items-start justify-between md:px-12 py-4 container">
      <div className="text-left flex w-1/4">
        <SkeletonH1 />
      </div>
      <HorizontalDivider />
      <div className="grid grid-cols-3 py-8 w-full">
        <div className="col-span-1">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col h-full w-full text-left justify-center gap-3 pl-10">
            <div className="w-8">
              <SkeletonP />
            </div>
            <div className="w-32">
              <SkeletonH1 />
            </div>
            <div className="w-48">
              <SkeletonH2 />
            </div>
            <div className="flex flex-row gap-8">
              <div className="w-16">
                <SkeletonP />
              </div>
              <div className="w-8">
                <SkeletonP />
              </div>
            </div>
            <div className="w-12">
              <SkeletonP />
            </div>
          </div>
        </div>
      </div>
      <HorizontalDivider />

      <div className="grid grid-cols-3 py-8 w-full">
        <div className="col-span-1">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col h-full w-full text-left justify-center gap-3 pl-10">
            <div className="w-8">
              <SkeletonP />
            </div>
            <div className="w-32">
              <SkeletonH1 />
            </div>
            <div className="w-48">
              <SkeletonH2 />
            </div>
            <div className="flex flex-row gap-8">
              <div className="w-16">
                <SkeletonP />
              </div>
              <div className="w-8">
                <SkeletonP />
              </div>
            </div>
            <div className="w-12">
              <SkeletonP />
            </div>
          </div>
        </div>
      </div>
      <HorizontalDivider />

      <div className="grid grid-cols-3 py-8 w-full">
        <div className="col-span-1">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col h-full w-full text-left justify-center gap-3 pl-10">
            <div className="w-8">
              <SkeletonP />
            </div>
            <div className="w-32">
              <SkeletonH1 />
            </div>
            <div className="w-48">
              <SkeletonH2 />
            </div>
            <div className="flex flex-row gap-8">
              <div className="w-16">
                <SkeletonP />
              </div>
              <div className="w-8">
                <SkeletonP />
              </div>
            </div>
            <div className="w-12">
              <SkeletonP />
            </div>
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid grid-cols-3 py-8 w-full">
        <div className="col-span-1">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col h-full w-full text-left justify-center gap-3 pl-10">
            <div className="w-8">
              <SkeletonP />
            </div>
            <div className="w-32">
              <SkeletonH1 />
            </div>
            <div className="w-48">
              <SkeletonH2 />
            </div>
            <div className="flex flex-row gap-8">
              <div className="w-16">
                <SkeletonP />
              </div>
              <div className="w-8">
                <SkeletonP />
              </div>
            </div>
            <div className="w-12">
              <SkeletonP />
            </div>
          </div>
        </div>
      </div>
      <HorizontalDivider />

      <div className="col-start-3 col-span-6 my-4 mx-4">
        <button className="w-full py-2 text-center text-sm font-semibold  bg-gray-200 rounded hover:bg-blue-200">
          Load more...
        </button>
      </div>
    </main>
  );
};

export default BlogViewSkeleton;
