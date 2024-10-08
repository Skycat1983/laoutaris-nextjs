"use server";

import ArtworkLayout from "@/components/layouts/ArtworkLayout";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import dbConnect from "@/utils/mongodb";
import { delay } from "@/utils/debug";

export default async function FavouritedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);
  const artworkResult = await fetchArtwork(params.artworkId);
  const artwork = artworkResult.success ? artworkResult.data : null;

  //TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

  // return <>{artwork && <ArtworkView {...artwork} />}</>;
  return <>{artwork && <ArtworkLayout {...artwork} />}</>;
}

// export default async function Artwork({
//   params,
// }: {
//   params: { artworkId: string };
// }) {
//   await dbConnect();
//   // const session = await getServerSession(authOptions);
//   const artworkResult = await fetchArtwork(params.artworkId);
//   const artwork = artworkResult.success ? artworkResult.data : null;

//   console.log("artwork [artworkId]", artwork);

//   return (
//     <>
//       <div className="max-w-full m-4">
//         {artwork && (
//           <Image
//             src={artwork.image.secure_url}
//             width={artwork.image.pixelWidth}
//             height={artwork.image.pixelHeight}
//             alt="Artwork"
//             className="contain"
//           />
//         )}
//       </div>
//       <div className="max-w-full m-4">
//         {/* {artwork && <ArtworkInfoCard watchlisted={false} {...artwork} />}
//          */}
//         {artwork && <ArtInfoTabs {...artwork} />}
//       </div>
//     </>
//   );
// }
