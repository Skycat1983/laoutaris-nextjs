import Subnav from "@/components/ui/subnav/Subnav";
import { fetchUserFields } from "@/lib/server/user/data-fetching/fetchUserFields";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { IFrontendUser } from "@/lib/client/types/userTypes";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect("http://localhost:3000");
  }

  const email = session.user.email;

  const userResponse = await fetchUserFields<Partial<IFrontendUser>>(email, [
    "favourites watchlist",
  ]);

  let favouritesCount = 0;
  let watchlistCount = 0;

  // check if the response is successful and data exists
  if (userResponse.success && userResponse.data) {
    favouritesCount = userResponse.data.favourites?.length || 0;
    watchlistCount = userResponse.data.watchlist?.length || 0;
  } else {
    //!  handle the error case
    console.error("Failed to fetch user data:", userResponse.message);
  }

  // Define the sub-navigation links
  const userLinks: SubnavLink[] = [
    {
      title: "Dashboard",
      slug: "dashboard",
    },
    {
      title: "Favourites",
      slug: "favourites",
      disabled: favouritesCount === 0, // Disabled if no favourites
    },
    {
      title: "Watchlist",
      slug: "watchlist",
      disabled: watchlistCount === 0, // Disabled if no watchlist items
    },
  ];

  const stem = "account";

  return (
    <section className="p-0 m-0">
      {userLinks && <Subnav links={userLinks} stem={stem} />}
      {children}
    </section>
  );
}
