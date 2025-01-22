import dbConnect from "@/utils/mongodb";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { getUserSubnavLinks } from "@/lib/server/user/use_cases/getUserSubnavLinks";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import { Suspense } from "react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const userLinks = getUserSubnavLinks;

  return (
    <section className="p-0 m-0">
      <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={userLinks} />
      </Suspense>
      {children}
    </section>
  );
}
