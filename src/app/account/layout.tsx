import Subnav from "@/components/ui/subnav/Subnav";
import dbConnect from "@/utils/mongodb";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  const stem = "account";
  const userLinks: SubnavLink[] = [
    {
      title: "Favourites",
      slug: "favourites",
    },
    {
      title: "Watchlist",
      slug: "watchlist",
    },
    {
      title: "Comments",
      slug: "comments",
    },
  ];

  return (
    <section className="p-0 m-0">
      {userLinks && <Subnav links={userLinks} stem={stem} />}
      {children}
    </section>
  );
}
