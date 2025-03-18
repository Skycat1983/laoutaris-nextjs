import Image from "next/image";
import { buildArtworkSearchUrl } from "@/lib/utils/urlHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { useState } from "react";

import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants";
import { Decade, ArtStyle, Surface } from "@/lib/data/types";

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
  <div className="flex flex-col gap-4 sm:flex-row">
    <Select
      onValueChange={(value: ArtStyle) =>
        setFilters((prev) => ({ ...prev, artstyle: value }))
      }
    >
      <SelectTrigger className="w-full sm:w-[180px] bg-white">
        <SelectValue placeholder="Select Style" />
      </SelectTrigger>
      <SelectContent>
        {ARTSTYLE_OPTIONS.map((style) => (
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
      <SelectTrigger className="w-full sm:w-[180px] bg-white">
        <SelectValue placeholder="Select Surface" />
      </SelectTrigger>
      <SelectContent>
        {SURFACE_OPTIONS.map((surface) => (
          <SelectItem key={surface} value={surface}>
            {surface.charAt(0).toUpperCase() + surface.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select
      onValueChange={(value: Decade) =>
        setFilters((prev) => ({ ...prev, decade: value }))
      }
    >
      <SelectTrigger className="w-full sm:w-[180px] bg-white">
        <SelectValue placeholder="Select Decade" />
      </SelectTrigger>
      <SelectContent>
        {DECADE_OPTIONS.map((decade) => (
          <SelectItem key={decade} value={decade}>
            {decade}
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
    <div className="relative h-[850px] w-full overflow-hidden">
      <Image
        src={PLACEHOLDER_URL}
        layout="fill"
        objectFit="cover"
        alt="Browse our collection"
        quality={100}
        priority={true}
        className="scale-110"
      />

      <div className="absolute inset-0 flex items-end justify-center mb-24 pb-48 sm:pb-24 sm:mb-0 p-8">
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-8 rounded-lg w-[90%] sm:w-[600px] shadow-xl text-center mx-4">
          <h1 className="text-2xl sm:text-3xl font-cormorant text-gray-900 mb-4 sm:mb-6">
            Explore the Collection
          </h1>
          <div className="space-y-4 sm:space-y-6">
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

export { FilterableArtworks, FilterableArtworks2 };

const FilterableArtworks2 = () => {
  const PLACEHOLDER_URL =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018096/artwork/z0e49vzsyidp9ghjntzz.jpg";
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
    <div className="relative h-[850px] w-full overflow-hidden">
      <Image
        src={PLACEHOLDER_URL}
        layout="fill"
        objectFit="cover"
        alt="Browse our collection"
        quality={100}
        priority={true}
        className="scale-110"
      />

      <div className="absolute inset-0 flex items-end justify-center mb-24 pb-48 sm:pb-24 sm:mb-0 p-8">
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-8 rounded-lg w-[90%] sm:w-[600px] shadow-xl text-center mx-4">
          <h1 className="text-2xl sm:text-3xl font-cormorant text-gray-900 mb-4 sm:mb-6">
            Explore the Collection
          </h1>
          <div className="space-y-4 sm:space-y-6">
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
