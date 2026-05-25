import tightCropLogo from "../../../../../prototype_logos/jl_logo_tight_crop.png";
import logoVariation1 from "../../../../../prototype_logos/joseph_laoutaris_logo_variation_1.png";
import logoVariation4 from "../../../../../prototype_logos/joseph_laoutaris_logo_variation_4.png";
import newLogo from "../../../../../prototype_logos/new_logo.png";
import type { StaticImageData } from "next/image";

export const prototypeNavLogoOptions = [
  {
    id: "tight-crop",
    label: "Tight crop",
    image: tightCropLogo,
  },
  {
    id: "variation-1",
    label: "Variation 1",
    image: logoVariation1,
  },
  {
    id: "variation-4",
    label: "Variation 4",
    image: logoVariation4,
  },
  {
    id: "new-logo",
    label: "New logo",
    image: newLogo,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  image: StaticImageData;
}>;

export type PrototypeNavLogoId = (typeof prototypeNavLogoOptions)[number]["id"];

export const DEFAULT_PROTOTYPE_NAV_LOGO_ID: PrototypeNavLogoId =
  prototypeNavLogoOptions[0].id;
