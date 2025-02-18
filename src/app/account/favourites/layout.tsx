import { FavouritesPaginationLoader } from "@/components/loaders/componentLoaders/FavouritesPaginationLoader";
import PaginationSkeleton from "../../../../unused/PaginationSkeleton";
import { Suspense } from "react";

export default async function FavouritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      {children}
      <Suspense fallback={<PaginationSkeleton />}>
        <FavouritesPaginationLoader />
      </Suspense>
    </section>
  );
}

{
  /* <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">More of your favourites</h1> */
}
{
  /* <ServerPagination
        stem="account"
        artworkLinks={data.favourites}
        collectionSlug={"favourites"}
      /> */
}
{
  /* <div className="px-4 py-8">
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
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div> */
}

// const session = await getServerSession(authOptions);
// const { BASEURL } = config;

// if (!session || !session.user || !session.user.email) {
//   redirect(BASEURL);
// }

// const userKey = "email";
// const userValue = session.user.email;
// const userFields = ["favourites"];
// const artworkFields = [
//   "_id",
//   "image.secure_url",
//   "image.pixelHeight",
//   "image.pixelWidth",
// ];

// const response = await fetchUserFavourites<FrontendUserWithFavourites>(
//   userKey,
//   userValue,
//   userFields,
//   artworkFields
// );

// if (!response.success) {
//   console.error("Failed to fetch user data:", response.message);
//   redirect(BASEURL);
// }

// const { data } = response;
