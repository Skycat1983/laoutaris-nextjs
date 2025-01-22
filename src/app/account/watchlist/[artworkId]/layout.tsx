import ArtworkViewSkeleton from "@/components/skeletons/ArtworkViewSkeleton";
import { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>{children}</Suspense>
    </>
  );
};

export default layout;
