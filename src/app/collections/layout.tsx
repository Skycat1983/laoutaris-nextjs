import { Suspense } from "react";
import { CollectionsSubnavLoader } from "@/components/loaders/componentLoaders/CollectionsSubnavLoader";
import { SubNavSkeleton } from "@/components/ui/subnav/Subnav";

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
