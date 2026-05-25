import { AccountSubnavLoader } from "@/components/loaders/componentLoaders/AccountSubnavLoader";
import { SubnavSkeleton } from "@/components/modules/navigation/subnav/Subnav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-0 m-0">
      <Suspense fallback={<SubnavSkeleton />}>
        <AccountSubnavLoader />
      </Suspense>
      {children}
    </section>
  );
}
