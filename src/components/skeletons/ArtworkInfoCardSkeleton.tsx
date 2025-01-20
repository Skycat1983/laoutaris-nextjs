import SkeletonH1 from "@/components/ui/common/skeletons/SkeletonH1";
import SkeletonH2 from "@/components/ui/common/skeletons/SkeletonH2";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const ArtworkInfoCardSkeleton = () => {
  return (
    <div className="  flex flex-col text-left space-y-4 h-auto w-[300px] md:w-[500px] md:p-24 md:bg-zinc-200/5 md:shadow">
      <div className="w-[250px]">
        <SkeletonH1 />
      </div>

      <div className="w-[120px]">
        <SkeletonH2 />
      </div>
      <div className="w-[100px]">
        <SkeletonH2 />
      </div>
      <hr />
      <div className="w-[180px]">
        <SkeletonH2 />
      </div>
      <div className="w-[140px]">
        <SkeletonH2 />
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <div className="flex flex-row w-full justify-between py-3">
          <div className="w-[180px]">
            <SkeletonH2 />
          </div>
          <Skeleton className="w-[23px] rounded-full" />
        </div>
        <div className="flex flex-row w-full justify-between py-3">
          <div className="w-[180px]">
            <SkeletonH2 />
          </div>
          <Skeleton className="w-[23px] rounded-full" />
        </div>
      </div>
      <hr />
      <div className="w-full flex flex-col gap-3 md:flex-row md:gap-5 lg:flex-row">
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
      </div>
    </div>
  );
};

export default ArtworkInfoCardSkeleton;
