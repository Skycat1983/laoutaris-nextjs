import { delay } from "@/utils/debug";
import React from "react";
import PaginationItem from "./PaginationItem";
import CollectionInfo from "../common/CollectionInfo";
import PaginationLayout from "@/components/layouts/PaginationLayout";
import { ArtworkNavFields } from "@/lib/types/navigationTypes";
import { buildUrl } from "@/utils/buildUrl";
export interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

interface PaginationProps {
  items: ArtworkNavFields[];
}

export function Pagination({ items }: PaginationProps) {
  return (
    <>
      <CollectionInfo
        heading="More from this collection"
        subheading={`${items.length} pieces`}
      />
      <PaginationLayout>
        {items.map((artwork) => (
          <PaginationItem
            key={artwork._id}
            secure_url={artwork.image.secure_url}
            height={artwork.image.pixelHeight}
            width={artwork.image.pixelWidth}
            link_to={buildUrl(["collections", artwork._id])}
          />
        ))}
      </PaginationLayout>
    </>
  );
}

// export interface PaginationArtworkLink {
//   secure_url: string;
//   height: number;
//   width: number;
//   link_to: string;
// }

// interface PaginationProps {
//   getData: () => Promise<PaginationArtworkLink[]>;
// }

// const Pagination = async ({ getData }: PaginationProps) => {
//   // await delay(2000);

//   const paginationData = await getData();

//   return (
//     <>
//       <CollectionInfo
//         heading="More from this collection"
//         subheading={`${paginationData.length} pieces`}
//       />
//       <PaginationLayout>
//         {paginationData.map((artworkLink) => (
//           <PaginationItem
//             key={artworkLink.link_to}
//             secure_url={artworkLink.secure_url}
//             height={artworkLink.height}
//             width={artworkLink.width}
//             link_to={artworkLink.link_to}
//           />
//         ))}
//       </PaginationLayout>
//       ;
//     </>
//   );
// };

// export { Pagination };
