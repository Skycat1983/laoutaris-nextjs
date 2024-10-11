import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import {
  IFrontendUser,
  IFrontendUserPopulatedWatchlist,
  IFrontendUserType,
} from "@/lib/client/types/userTypes";
import config from "@/lib/config";
import { fetchUserWatchlist } from "@/lib/server/user/data-fetching/fetchUserWatchlist";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type SelectedUserFields = Pick<IFrontendUserType, "watchlist">;
type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;
type UserWatchlist = SelectedUserFields & {
  watchlist: SelectedArtworkFields[];
};

export default async function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const { BASEURL } = config;

  if (!session || !session.user || !session.user.email) {
    redirect(BASEURL);
  }

  const userKey = "email";
  const userValue = session.user.email;
  const userFields = ["watchlist"];
  const artworkFields = [
    "_id",
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  const response = await fetchUserWatchlist<UserWatchlist>(
    userKey,
    userValue,
    userFields,
    artworkFields
  );

  if (!response.success) {
    console.error("Failed to fetch user data:", response.message);
    redirect(BASEURL);
  }

  console.log("response in watchlistLayout:>> ", response);

  return (
    <section className="">
      {children}
      {/* <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">More from your watchlist</h1>
      {artworkLinks && (
        <ServerPagination
          stem="account"
          artworkLinks={artworkLinks}
          collectionSlug={"favourites"}
        />
      )}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">Your watchlist</h1>
      <p className="px-4 text-primary">
        Artworks you have watchlisted will appear here. You can add and remove
        artworks from your collection at any time. The purpose of this
        collection is as a place where you can keep track of artworks or prints
        you might be interested in purchasing. We will notify you by email when
        any of these artworks are available for sale.
      </p>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="bg-slate-800/10 w-full">
        <ArtistProfile />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div> */}
    </section>
  );
}

// interface ArtworkPaginationLink {
//   id: string;
//   imageData: {
//     secure_url: string;
//     pixelHeight: number;
//     pixelWidth: number;
//   };
// }

// const user = (await UserModel.findOne({ email: session.user.email })
//   .populate("watchlist")
//   .lean()) as IFrontendUser;

// if (!user || !user.favourites) {
//   redirect("http://localhost:3000");
// }

// const convertToPaginationLink = (artwork: any): ArtworkPaginationLink => {
//   return {
//     id: artwork._id.toString(),
//     imageData: {
//       secure_url: artwork.image.secure_url,
//       pixelHeight: artwork.image.pixelHeight,
//       pixelWidth: artwork.image.pixelWidth,
//     },
//   };
// };

// const artworkLinks = user.watchlist.map((artwork) =>
//   convertToPaginationLink(artwork)
// );
