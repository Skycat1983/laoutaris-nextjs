"use server";

import dbConnect from "@/lib/db/mongodb";

export default async function WatchlistedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);
  // const { artworkId } = params;
  // const artworkData: SanitizedArtwork = await getArtworkView({
  //   collectionSlug: "favourites",
  //   artworkId,
  // });

  // console.log("params :>> ", params);

  return (
    <>
      {/* <ArtworkView {...artworkData} /> */}
      {/* <ArtInfoTabs {...artworkData} /> */}
    </>
  );
}
