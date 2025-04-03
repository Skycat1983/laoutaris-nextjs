import { TailwindColorIcon } from "@/components/elements/icons";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import Link from "next/link";
import { buildArtworkSearchUrl } from "@/lib/utils/urlUtils";
import { ColourInfo } from "@/lib/data/types";

interface HexColorPaletteProps {
  colors: ColourInfo[];
  label: string;
}

const HexColorIcon = ({ hexColor }: { hexColor: ColourInfo }) => {
  const searchUrl = buildArtworkSearchUrl({
    sortBy: "colorProximity",
    sortColor: hexColor.color,
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={searchUrl}
            className="block w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: hexColor.color }}
            aria-label={`Find artworks with color ${hexColor.color}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {hexColor.color} ({hexColor.percentage.toFixed(1)}%)
            <br />
            Click to find artworks with similar colours
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const HexColorPalette: React.FC<HexColorPaletteProps> = ({ colors, label }) => {
  return (
    <Disclosure>
      <DisclosureButton className="py-2 text-left">
        <div className="flex flex-row justify-between">
          <p className="font-archivo text-md font-light text-gray-500">
            {label}
          </p>
          <ChevronDown className="w-6 h-6" />
        </div>
      </DisclosureButton>
      <DisclosurePanel className="text-gray-500">
        <div className="flex flex-row flex-wrap gap-2">
          {colors.map((hexColor, i) => (
            <HexColorIcon key={i} hexColor={hexColor} />
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

interface CloudinaryColorPaletteProps {
  colors: ColourInfo[];
  label: string;
}

// UNUSED
const CloudinaryColorPalette: React.FC<CloudinaryColorPaletteProps> = ({
  colors,
  label,
}) => {
  return (
    <Disclosure>
      <DisclosureButton className="py-2 text-left">
        <div className="flex flex-row justify-between">
          <p className="font-archivo text-md font-light text-gray-500">
            {label}
          </p>
          <ChevronDown className="w-6 h-6" />
        </div>
      </DisclosureButton>
      <DisclosurePanel className="text-gray-500">
        <div className="flex flex-row flex-wrap gap-2">
          {colors.map((cloudinaryColor, i) => (
            <TailwindColorIcon key={i} color={cloudinaryColor.color} />
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export { HexColorPalette, CloudinaryColorPalette };
