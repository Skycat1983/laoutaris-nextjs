import { AccountSubnavLoader } from "@/components/loaders/componentLoaders/AccountSubnavLoader";
import { SubnavSkeleton } from "@/components/modules/navigation/subnav/Subnav";
import dbConnect from "@/lib/db/mongodb";
import { Suspense } from "react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  return (
    <section className="p-0 m-0">
      <Suspense fallback={<SubnavSkeleton />}>
        <AccountSubnavLoader />
      </Suspense>
      {children}
    </section>
  );
}
