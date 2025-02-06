import { Suspense } from "react";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import { CollectionsSubnavLoader } from "@/components/loaders/CollectionsSubnavLoader";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense fallback={<SubNavSkeleton />}>
        <CollectionsSubnavLoader section={"collections"} />
      </Suspense>
      {children}
    </section>
  );
}
