import CollectionInfo from "../components/ui/common/CollectionInfo";
import { Skeleton } from "../components/ui/shadcn/skeleton";

const PaginationSkeleton = () => {
  return (
    <>
      <CollectionInfo
        heading="More from this collection"
        subheading={"Loading..."}
      />
      {/* <PaginationLayout> */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <Skeleton key={index} className="h-[200px] lg:h-[300px] w-[200px]" />
      ))}
      {/* </PaginationLayout> */}
    </>
  );
};

export default PaginationSkeleton;
