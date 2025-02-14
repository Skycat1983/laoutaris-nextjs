import { Suspense } from "react";
import { CollectionsSubnavLoader } from "@/components/loaders/componentLoaders/CollectionsSubnavLoader";
import { SubnavSkeleton } from "@/components/ui/navigation/subnav/Subnav";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense fallback={<SubnavSkeleton />}>
        <CollectionsSubnavLoader section={"collections"} />
      </Suspense>
      {children}
    </section>
  );
}
