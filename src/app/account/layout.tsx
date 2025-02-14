import dbConnect from "@/lib/db/mongodb";
import { getUserSubnavLinks } from "@/lib/old_code/user/use_cases/getUserSubnavLinks";
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
      {/* <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={userLinks} />
      </Suspense> */}
      {children}
    </section>
  );
}
