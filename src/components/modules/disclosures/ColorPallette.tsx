import HexColorIcon from "@/components/elements/icons/HexColorIcon";
import TailwindColorIcon from "@/components/elements/icons/TailwindColorIcon";
import { ColorInfo } from "@/lib/data/types/artworkTypes";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface HexColorPaletteProps {
  colors: ColorInfo[];
  label: string;
}

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
  colors: ColorInfo[];
  label: string;
}

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
