import Image from "next/image";
import Link from "next/link";
import { buildArtworkSearchUrl } from "@/lib/utils/urlHelpers";
import { DimmedOverlay } from "./Overlays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { useState } from "react";
import { ArtStyle, Decade, Surface } from "@/lib/data/types";
import {
  DECADES,
  ART_STYLES,
  SURFACES,
} from "@/lib/constants/artworkFilterOptions";

const FilterSelects = ({
  filters,
  setFilters,
}: {
  filters: {
    decade: Decade | "";
    artstyle: ArtStyle | "";
    surface: Surface | "";
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      decade: Decade | "";
      artstyle: ArtStyle | "";
      surface: Surface | "";
    }>
  >;
}) => (
  <div className="flex gap-4">
    <Select
      onValueChange={(value: Decade) =>
        setFilters((prev) => ({ ...prev, decade: value }))
      }
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select Decade" />
      </SelectTrigger>
      <SelectContent>
        {DECADES.map((decade) => (
          <SelectItem key={decade} value={decade}>
            {decade}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      onValueChange={(value: ArtStyle) =>
        setFilters((prev) => ({ ...prev, artstyle: value }))
      }
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select Style" />
      </SelectTrigger>
      <SelectContent>
        {ART_STYLES.map((style) => (
          <SelectItem key={style} value={style}>
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      onValueChange={(value: Surface) =>
        setFilters((prev) => ({ ...prev, surface: value }))
      }
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select Surface" />
      </SelectTrigger>
      <SelectContent>
        {SURFACES.map((surface) => (
          <SelectItem key={surface} value={surface}>
            {surface.charAt(0).toUpperCase() + surface.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const FilterableArtworks = () => {
  const PLACEHOLDER_URL =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1740842898/artwork/teywcuexka9cjcrw79x5.jpg";
  const [filters, setFilters] = useState<{
    decade: Decade | "";
    artstyle: ArtStyle | "";
    surface: Surface | "";
  }>({
    decade: "",
    artstyle: "",
    surface: "",
  });

  const handleSearch = () => {
    const searchUrl = buildArtworkSearchUrl({
      ...filters,
      filterMode: "ALL",
    });
    window.location.href = searchUrl;
  };

  return (
    <div className="relative h-[850px] w-full">
      <Image
        src={PLACEHOLDER_URL}
        layout="fill"
        objectFit="cover"
        alt="Browse our collection"
        quality={100}
        priority={true}
        className="scale-110"
      />

      <div className="absolute inset-0 flex items-end justify-center pb-24 bg-gradient-to-r ">
        {/* 
      <div className="absolute inset-0 flex items-end justify-center pb-24 bg-gradient-to-r from-transparent to-black/70"> */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg w-[600px] shadow-xl text-center">
          <h1 className="text-3xl font-cormorant text-gray-900 mb-6">
            Explore the Collection
          </h1>
          <div className="space-y-6">
            <FilterSelects filters={filters} setFilters={setFilters} />
            <button
              onClick={handleSearch}
              className="bg-black text-white px-8 py-3 rounded-md font-archivo hover:bg-gray-800 transition-colors w-full"
            >
              Search Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Variation 5: Minimal with Animated Entrance

export { FilterableArtworks };
