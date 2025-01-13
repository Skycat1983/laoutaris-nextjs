import { Skeleton } from "../ui/shadcn/skeleton";

const SectionHeadingSkeleton = () => {
  return (
    <div className="w-full px-4 py-4">
      <Skeleton className="h-12 w-48" />
    </div>
  );
};

export default SectionHeadingSkeleton;
