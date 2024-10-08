import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { UserModel } from "@/lib/server/models";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ArtworkPaginationLink {
  id: string;
  imageData: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

export default async function FavouritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect("http://localhost:3000");
  }

  const user = (await UserModel.findOne({ email: session.user.email })
    .populate("favourites")
    .lean()) as IFrontendUser;

  if (!user || !user.favourites) {
    redirect("http://localhost:3000");
  }

  const convertToPaginationLink = (artwork: any): ArtworkPaginationLink => {
    return {
      id: artwork._id.toString(),
      imageData: {
        secure_url: artwork.image.secure_url,
        pixelHeight: artwork.image.pixelHeight,
        pixelWidth: artwork.image.pixelWidth,
      },
    };
  };

  const artworkLinks = user.favourites.map((artwork) =>
    convertToPaginationLink(artwork)
  );

  console.log("artworkLinks in favoiurites:>> ", artworkLinks);
  // } else {
  //   redirect("http://localhost:3000");
  // }

  //   const artworkLinks = user.favourites;

  return (
    <section className="">
      {children}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">More of your favourites</h1>
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
      <h1 className="px-4 py-6 text-2xl font-bold">Your custom collection</h1>
      <p className="px-4 text-primary">
        Artworks you have favourited will appear here. You can add and remove
        artworks from your collection at any time. Meanwhile, your watchlist is
        where you can keep track of artworks or prints you might be interested
        in purchasing. We will notify you by email when any of these artworks
        are available for sale.
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
      </div>
    </section>
  );
}
