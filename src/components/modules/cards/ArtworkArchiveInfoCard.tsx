import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { buildArtworkSearchUrl } from "@/lib/utils/urlUtils";
import { FavouritesButton } from "@/components/elements/buttons/FavouritesButton";
import { WatchlistButton } from "@/components/elements/buttons/WatchlistButton";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { ColourInfo } from "@/lib/data/types";

type ArtworkArchiveInfoCardProps = ArtworkFrontend & {
  curatorialNote?: string | null;
};

type MetadataRowProps = {
  label: string;
  value: string;
};

const toDisplayLabel = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("-")
    )
    .join(" ");

const formatMedium = (medium: string, surface: string) => {
  const displayMedium = toDisplayLabel(medium);
  const displaySurface = surface.trim().toLowerCase();

  return displaySurface
    ? `${displayMedium} on ${displaySurface}`
    : displayMedium;
};

const formatDimensions = ({
  pixelHeight,
  pixelWidth,
}: {
  pixelHeight: number;
  pixelWidth: number;
}) => `${pixelHeight} x ${pixelWidth} px`;

const MetadataRow = ({ label, value }: MetadataRowProps) => (
  <div className="grid grid-cols-[7.5rem,minmax(0,1fr)] gap-5 border-t border-gray-200 py-4 font-archivo text-sm sm:grid-cols-[9rem,minmax(0,1fr)]">
    <dt className="text-xs font-semibold uppercase text-gray-700">{label}</dt>
    <dd className="min-w-0 break-words text-base text-gray-950">{value}</dd>
  </div>
);

const PaletteSwatch = ({ color }: { color: ColourInfo }) => {
  const searchUrl = buildArtworkSearchUrl({
    sortBy: "colorProximity",
    sortColor: color.color,
  });

  return (
    <Link
      href={searchUrl}
      className="block h-8 w-8 border border-black/10 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 sm:h-10 sm:w-10"
      style={{ backgroundColor: color.color }}
      aria-label={`Find artworks with color ${color.color}`}
    />
  );
};

export async function ArtworkArchiveInfoCard({
  curatorialNote,
  ...artwork
}: ArtworkArchiveInfoCardProps) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  const paletteColors = artwork.image.hexColors.filter(({ color }) =>
    Boolean(color)
  );
  const note = curatorialNote?.trim();

  return (
    <section
      aria-labelledby="artwork-archive-title"
      className="fade-in w-full max-w-[34rem] px-5 py-6 text-left sm:px-8 lg:px-0 lg:py-8"
    >
      <div className="flex items-center gap-7">
        <p className="font-archivo text-xs font-semibold uppercase text-gray-950">
          {toDisplayLabel(artwork.artstyle)}
        </p>
        <span className="h-px flex-1 bg-gray-300" aria-hidden="true" />
      </div>

      <h1
        id="artwork-archive-title"
        className="mt-8 break-words font-cormorant text-5xl font-normal leading-none text-gray-950 sm:text-6xl lg:text-7xl"
      >
        {artwork.title}
      </h1>

      <dl className="mt-10">
        <MetadataRow label="Decade" value={artwork.decade} />
        <MetadataRow
          label="Medium"
          value={formatMedium(artwork.medium, artwork.surface)}
        />
        <MetadataRow label="Style" value={toDisplayLabel(artwork.artstyle)} />
        <MetadataRow
          label="Dimensions"
          value={formatDimensions(artwork.image)}
        />
      </dl>

      {paletteColors.length > 0 && (
        <div className="border-t border-gray-200 py-8">
          <p className="font-archivo text-xs font-semibold uppercase text-gray-700">
            Colour palette
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            {paletteColors.map((color, index) => (
              <PaletteSwatch key={`${color.color}-${index}`} color={color} />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 font-archivo sm:grid-cols-2 [&_button]:rounded-none [&_button]:border [&_button]:border-gray-950 [&_button]:bg-transparent [&_button]:text-xs [&_button]:font-semibold [&_button]:uppercase [&_button]:text-gray-950 [&_button]:hover:bg-gray-100">
        <WatchlistButton
          isWatchlisted={artwork.isWatchlisted}
          artworkId={artwork._id}
          isLoggedIn={isLoggedIn}
        />
        <FavouritesButton
          isLoggedIn={isLoggedIn}
          isFavourited={artwork.isFavourited}
          artworkId={artwork._id}
        />
      </div>

      {note && (
        <aside className="mt-10 font-archivo">
          <p className="text-xs font-semibold uppercase text-gray-700">
            Curatorial note
          </p>
          <p className="mt-5 max-w-prose text-sm leading-7 text-gray-950">
            {note}
          </p>
        </aside>
      )}
    </section>
  );
}
