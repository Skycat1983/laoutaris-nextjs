import { Search } from "lucide-react";
import { ArtworkArchiveInfoCard } from "../modules/cards/ArtworkArchiveInfoCard";
import ArtworkShopSection from "../modules/cards/ArtworkShopSection";
import { MagnifierImage } from "../modules/MagnifierImage";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { ArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";

type ArtworkViewProps = ArtworkFrontend & {
  shopProducts?: ArtworkShopProducts;
};

const ArtworkView = ({ shopProducts, ...artwork }: ArtworkViewProps) => {
  return (
    <>
      <div
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-8 lg:grid-cols-[minmax(20rem,34rem),minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24"
      >
        <div className="flex justify-center lg:justify-start">
          <ArtworkArchiveInfoCard {...artwork} />
        </div>

        <figure className="flex min-w-0 flex-col items-center justify-start gap-5 lg:items-start">
          <div className="flex max-h-[70vh] w-full max-w-3xl justify-center lg:justify-start">
            {artwork && (
              <MagnifierImage
                src={artwork.image.secure_url}
                width={artwork.image.pixelWidth}
                height={artwork.image.pixelHeight}
                alt={artwork.title || "Artwork"}
                magnifierSize={250}
                magnificationLevel={8}
              />
            )}
          </div>
          <figcaption className="flex w-full items-center justify-center gap-2 text-sm lg:justify-start">
            <p className="text-neutral-400 px-2">Hover for magnified view:</p>
            <Search className="text-neutral-400" />
          </figcaption>
        </figure>
      </div>

      {/* Shop Section - Only shows if artwork has Shopify products */}
      <ArtworkShopSection artwork={artwork} shopProducts={shopProducts} />
    </>
  );
};

export { ArtworkView };
