import dbConnect from "@/utils/mongodb";
import { authOptions } from "../api/auth/[...nextauth]/route";

import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { buildUrl } from "@/utils/buildUrl";

type UserAccountSubnavOptions = Pick<IFrontendUser, "favourites" | "watchlist">;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);

  // If user is not authenticated, redirect to the homepage
  if (!session?.user?.email) {
    redirect("http://localhost:3000");
  }

  const email = session.user.email;

  // Fetch user data using Pick for type safety
  const response = await fetchUser<UserAccountSubnavOptions>("email", email, [
    "favourites",
    "watchlist",
  ]);

  if (!response.success) {
    console.error("Failed to fetch user data:", response.message);
  }

  let favouritesCount = 0;
  let watchlistCount = 0;

  // Check if the response is successful and data exists
  if (response.success && response.data) {
    favouritesCount = response.data.favourites?.length || 0;
    watchlistCount = response.data.watchlist?.length || 0;
  } else {
    //! Handle the error case
    console.error("Failed to fetch user data:", response.message);
  }

  // Define the sub-navigation links
  const userLinks = [
    {
      title: "Dashboard",
      slug: "dashboard",
      url: buildUrl(["account", "dashboard"]),
    },
    {
      title: "Favourites",
      slug: "favourites",
      url: buildUrl(["account", "favourites"]),
      disabled: favouritesCount === 0, // Disabled if no favourites
    },
    {
      title: "Watchlist",
      slug: "watchlist",
      url: buildUrl(["account", "watchlist"]),
      disabled: watchlistCount === 0, // Disabled if no watchlist items
    },
  ];

  return (
    <section className="p-0 m-0">
      <SubNavBar links={userLinks} />
      {children}
    </section>
  );
}
