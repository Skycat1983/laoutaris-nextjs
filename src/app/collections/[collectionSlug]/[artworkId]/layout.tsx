import { Suspense } from "react";
import ArtworkViewSkeleton from "@/components/skeletons/ArtworkViewSkeleton";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>{children}</Suspense>
    </>
  );
};

export default layout;
