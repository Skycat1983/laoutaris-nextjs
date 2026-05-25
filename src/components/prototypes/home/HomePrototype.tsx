"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import { PrototypeSectionPlaceholder } from "./PrototypeSectionPlaceholder";
import { BlogPrototypeSection } from "./BlogPrototypeSection";
import { BiographyPrototypeSection } from "./BiographyPrototypeSection";
import { CollectionPrototypeSection } from "./CollectionPrototypeSection";
import { ProjectPrototypeSection } from "./ProjectPrototypeSection";
import {
  ShopPrototypeSection,
  type ProductSizePreset,
} from "./ShopPrototypeSection";
import { prototypeSectionFrameClassName } from "./prototypeHomeLayout";
import {
  DEFAULT_PROTOTYPE_NAV_LOGO_ID,
  prototypeNavLogoOptions,
  type PrototypeNavLogoId,
} from "@/components/modules/navigation/prototypeMainNav/prototypeNavLogoOptions";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import type { CollectionFrontend } from "@/lib/data/types/collectionTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const prototypeSections = [
  {
    id: "hero",
    label: "Prototype hero",
    title: "Full-width landing hero workshop",
    description:
      "Reserved for the redesigned homepage opening section without changing the live archive homepage.",
    tone: "hero" as const,
    className: "min-h-[70vh]",
  },
  {
    id: "collections",
    label: "Collections",
    title: "Collections prototype slot",
    description:
      "Reserved for the image-guided collections section backed by the existing collection data path.",
    tone: "muted" as const,
  },
  {
    id: "biography",
    label: "Biography",
    title: "Biography prototype slot",
    description:
      "Reserved for the image-guided biography teaser section that will use the existing biography data path later.",
    tone: "dark" as const,
  },
  {
    id: "blog",
    label: "Blog",
    title: "Blog prototype slot",
    description:
      "Reserved for the image-guided blog teaser section that will use real blog entries in a later task.",
    tone: "light" as const,
  },
  {
    id: "project",
    label: "Project:",
    title: "Watch the documentary",
    description: "The life, ethos & regrets of Joseph Laoutaris",
    details: ["A short film about my grandfather", "By Heron Laoutaris"],
    tone: "light" as const,
  },
  {
    id: "shop",
    label: "Shop",
    title: "Shop prototype slot",
    description:
      "Reserved for the image-guided shop teaser section that can use enquiry-safe product data later.",
    tone: "dark" as const,
  },
];

const prototypeHomeTypographyCss = `
  .prototype-home-shell {
    --prototype-home-primary-bg: #f5f5f5;
    --prototype-home-primary-accent-color: #262626;
    --prototype-home-alt-accent-color: #5b4a3b;
  }

  .prototype-home-primary-bg {
    --prototype-home-section-accent-color: var(--prototype-home-primary-accent-color);
    --prototype-home-accent-muted: color-mix(in srgb, var(--prototype-home-section-accent-color) 34%, transparent);
    --prototype-home-accent-soft: color-mix(in srgb, var(--prototype-home-section-accent-color) 72%, transparent);
    background-color: var(--prototype-home-primary-bg);
  }

  .prototype-home-alt-bg {
    --prototype-home-section-accent-color: var(--prototype-home-alt-accent-color);
    --prototype-home-accent-muted: color-mix(in srgb, var(--prototype-home-section-accent-color) 34%, transparent);
    --prototype-home-accent-soft: color-mix(in srgb, var(--prototype-home-section-accent-color) 72%, transparent);
    background-color: var(--prototype-home-alt-bg);
  }

  .prototype-home-accent-text {
    color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-link {
    border-color: var(--prototype-home-section-accent-color);
    color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-link:hover {
    color: #262626;
  }

  .prototype-home-accent-border {
    border-color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-divider-border {
    border-color: var(--prototype-home-accent-muted);
  }

  .prototype-home-accent-divider {
    background-color: var(--prototype-home-accent-soft);
  }

  .prototype-home-shell .prototype-home-section-heading {
    font-size: calc(var(--prototype-heading-base) * var(--prototype-home-heading-scale, 1));
  }

  @media (min-width: 640px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-sm, var(--prototype-heading-base)) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 768px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1024px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base)))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1280px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-xl, var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base))))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1536px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-2xl, var(--prototype-heading-xl, var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base)))))) * var(--prototype-home-heading-scale, 1));
    }
  }
`;

const frameWidth = {
  wide: "1920px",
  inset: "1180px",
} as const;

const fontScale = {
  standard: "1",
  smaller: "0.9",
  compact: "0.82",
} as const;

const alternateBackgroundOptions = {
  stone: { label: "Chalk stone", value: "#eeece6" },
  plaster: { label: "Soft plaster", value: "#f5f4f1" },
  ivory: { label: "Warm ivory", value: "#f6f5f1" },
  ricePaper: { label: "Rice paper", value: "#f7f6f2" },
  bone: { label: "Bone white", value: "#f5f4f0" },
  oatMilk: { label: "Oat milk", value: "#f6f4ef" },
  porcelain: { label: "Porcelain white", value: "#f8f7f4" },
  linenWhite: { label: "Linen white", value: "#f7f5f1" },
} as const;

type PrototypeFramePreset = keyof typeof frameWidth;
type PrototypeFontPreset = keyof typeof fontScale;
type AlternateBackgroundPreset = keyof typeof alternateBackgroundOptions;

const DEFAULT_FRAME_PRESET: PrototypeFramePreset = "wide";
const DEFAULT_FONT_PRESET: PrototypeFontPreset = "smaller";
const DEFAULT_PRODUCT_SIZE_PRESET: ProductSizePreset = "feature";
const DEFAULT_ALTERNATE_BACKGROUND_PRESET: AlternateBackgroundPreset = "stone";

const prototypeNavHeightOptions = {
  compact: { label: "Compact nav", value: "80px" },
  standard: { label: "Standard nav", value: "96px" },
  gallery: { label: "Gallery nav", value: "112px" },
  tall: { label: "Tall nav", value: "128px" },
} as const;

type PrototypeNavHeightPreset = keyof typeof prototypeNavHeightOptions;

const DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET: PrototypeNavHeightPreset =
  "standard";

const prototypeNavLogoSizeOptions = {
  standard: {
    label: "Standard logo",
    height: "56px",
    width: "260px",
    mobileHeight: "46px",
    mobileWidth: "220px",
  },
  large: {
    label: "Large logo",
    height: "74px",
    width: "340px",
    mobileHeight: "50px",
    mobileWidth: "250px",
  },
  oversized: {
    label: "Oversized logo",
    height: "88px",
    width: "420px",
    mobileHeight: "56px",
    mobileWidth: "280px",
  },
} as const;

const prototypeNavPaddingOptions = {
  none: { label: "None", value: "0px" },
  tight: { label: "Tight", value: "6px" },
  standard: { label: "Standard", value: "12px" },
  airy: { label: "Airy", value: "18px" },
} as const;

const prototypeNavPaddingXOptions = {
  none: { label: "None", value: "0px" },
  tight: { label: "Tight", value: "8px" },
  standard: { label: "Standard", value: "16px" },
  wide: { label: "Wide", value: "24px" },
  gallery: { label: "Gallery", value: "32px" },
  edge: { label: "Edge", value: "40px" },
} as const;

const prototypeNavLinkSpacingOptions = {
  tight: { label: "Tight links", value: "12px" },
  standard: { label: "Standard links", value: "20px" },
  wide: { label: "Wide links", value: "28px" },
  airy: { label: "Airy links", value: "36px" },
  open: { label: "Open links", value: "48px" },
  gallery: { label: "Gallery links", value: "60px" },
  broad: { label: "Broad links", value: "72px" },
  grand: { label: "Grand links", value: "88px" },
  pavilion: { label: "Pavilion links", value: "104px" },
  maximum: { label: "Maximum links", value: "120px" },
} as const;

const prototypeNavLinkSizeOptions = {
  small: { label: "Small type", value: "14px" },
  standard: { label: "Standard type", value: "16px" },
  gallery: { label: "Gallery type", value: "18px" },
  large: { label: "Large type", value: "20px" },
  oversized: { label: "Oversized type", value: "22px" },
} as const;

const regularPrototypeNavFont = (label: string, family: string) => ({
  label,
  family,
  weight: "400",
  style: "normal",
  letterSpacing: "0",
});

const prototypeNavLinkFontOptions = {
  "archivo-regular": regularPrototypeNavFont(
    "Archivo Regular",
    "var(--font-archivo), sans-serif"
  ),
  cormorant: regularPrototypeNavFont(
    "Cormorant",
    "var(--font-cormorant), Georgia, serif"
  ),
  crimson: regularPrototypeNavFont(
    "Crimson Text",
    "var(--font-crimson), Georgia, serif"
  ),
  cinzel: regularPrototypeNavFont(
    "Cinzel Decorative",
    "var(--font-cinzel-decorative), Georgia, serif"
  ),
  baskerville: regularPrototypeNavFont(
    "Baskerville",
    'Baskerville, "Baskerville Old Face", "Times New Roman", serif'
  ),
  didot: regularPrototypeNavFont("Didot", 'Didot, "Times New Roman", serif'),
  "bodoni-72": regularPrototypeNavFont(
    "Bodoni 72",
    '"Bodoni 72", "Bodoni 72 Oldstyle", Didot, serif'
  ),
  "big-caslon": regularPrototypeNavFont(
    "Big Caslon",
    '"Big Caslon", "Book Antiqua", Georgia, serif'
  ),
  "hoefler-text": regularPrototypeNavFont(
    "Hoefler Text",
    '"Hoefler Text", Garamond, Georgia, serif'
  ),
  palatino: regularPrototypeNavFont(
    "Palatino",
    'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif'
  ),
  garamond: regularPrototypeNavFont(
    "Garamond",
    'Garamond, "Times New Roman", serif'
  ),
  "iowan-old-style": regularPrototypeNavFont(
    "Iowan Old Style",
    '"Iowan Old Style", Georgia, serif'
  ),
  charter: regularPrototypeNavFont(
    "Charter",
    'Charter, "Bitstream Charter", Georgia, serif'
  ),
  cochin: regularPrototypeNavFont("Cochin", "Cochin, Georgia, serif"),
  athelas: regularPrototypeNavFont("Athelas", "Athelas, Georgia, serif"),
  "new-york": regularPrototypeNavFont(
    "New York",
    '"New York", Georgia, serif'
  ),
  georgia: regularPrototypeNavFont("Georgia", "Georgia, serif"),
  times: regularPrototypeNavFont(
    "Times",
    '"Times New Roman", Times, serif'
  ),
  "american-typewriter": regularPrototypeNavFont(
    "American Typewriter",
    '"American Typewriter", Georgia, serif'
  ),
  copperplate: regularPrototypeNavFont(
    "Copperplate",
    'Copperplate, "Copperplate Gothic Light", Georgia, serif'
  ),
  optima: regularPrototypeNavFont("Optima", "Optima, sans-serif"),
  avenir: regularPrototypeNavFont("Avenir", "Avenir, sans-serif"),
  "avenir-next": regularPrototypeNavFont(
    "Avenir Next",
    '"Avenir Next", Avenir, sans-serif'
  ),
  "helvetica-neue": regularPrototypeNavFont(
    "Helvetica Neue",
    '"Helvetica Neue", Helvetica, Arial, sans-serif'
  ),
  "gill-sans": regularPrototypeNavFont(
    "Gill Sans",
    '"Gill Sans", "Gill Sans MT", Calibri, sans-serif'
  ),
  futura: regularPrototypeNavFont("Futura", "Futura, sans-serif"),
  "trebuchet-ms": regularPrototypeNavFont(
    "Trebuchet MS",
    '"Trebuchet MS", sans-serif'
  ),
  verdana: regularPrototypeNavFont("Verdana", "Verdana, sans-serif"),
  "lucida-grande": regularPrototypeNavFont(
    "Lucida Grande",
    '"Lucida Grande", "Lucida Sans Unicode", sans-serif'
  ),
  geneva: regularPrototypeNavFont("Geneva", "Geneva, sans-serif"),
  "century-gothic": regularPrototypeNavFont(
    "Century Gothic",
    '"Century Gothic", AppleGothic, sans-serif'
  ),
  "system-sans": regularPrototypeNavFont(
    "System Sans",
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ),
  "system-serif": regularPrototypeNavFont(
    "System Serif",
    'ui-serif, "New York", Georgia, serif'
  ),
  menlo: regularPrototypeNavFont(
    "Menlo",
    'Menlo, Monaco, Consolas, "Liberation Mono", monospace'
  ),
} as const;

const prototypeNavTintOptions = {
  off: { label: "Tint off", value: "#f5f5f5" },
  warm: { label: "Warm tint", value: "#efe3d4" },
  cool: { label: "Cool tint", value: "#e8edf0" },
} as const;

type PrototypeNavLogoSizePreset = keyof typeof prototypeNavLogoSizeOptions;
type PrototypeNavPaddingPreset = keyof typeof prototypeNavPaddingOptions;
type PrototypeNavPaddingXPreset = keyof typeof prototypeNavPaddingXOptions;
type PrototypeNavLinkSpacingPreset = keyof typeof prototypeNavLinkSpacingOptions;
type PrototypeNavLinkSizePreset = keyof typeof prototypeNavLinkSizeOptions;
type PrototypeNavLinkFontPreset = keyof typeof prototypeNavLinkFontOptions;
type PrototypeNavTintPreset = keyof typeof prototypeNavTintOptions;

const DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET: PrototypeNavLogoSizePreset =
  "large";
const DEFAULT_PROTOTYPE_NAV_PADDING_PRESET: PrototypeNavPaddingPreset =
  "standard";
const DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET: PrototypeNavPaddingXPreset =
  "none";
const DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET: PrototypeNavLinkSpacingPreset =
  "standard";
const DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET: PrototypeNavLinkSizePreset =
  "standard";
const DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET: PrototypeNavLinkFontPreset =
  "archivo-regular";
const DEFAULT_PROTOTYPE_NAV_TINT_PRESET: PrototypeNavTintPreset = "off";

type PrototypeHomeStyle = CSSProperties & {
  "--prototype-home-frame-max": string;
  "--prototype-home-heading-scale": string;
  "--prototype-home-alt-bg": string;
};

function PrototypeHomeControlRail({
  prototypeNavHeightPreset,
  prototypeNavLogoId,
  prototypeNavLogoSizePreset,
  prototypeNavPaddingPreset,
  prototypeNavPaddingXPreset,
  prototypeNavLinkSpacingPreset,
  prototypeNavLinkSizePreset,
  prototypeNavLinkFontPreset,
  prototypeNavTintPreset,
  onPrototypeNavHeightPresetChange,
  onPrototypeNavLogoIdChange,
  onPrototypeNavLogoSizePresetChange,
  onPrototypeNavPaddingPresetChange,
  onPrototypeNavPaddingXPresetChange,
  onPrototypeNavLinkSpacingPresetChange,
  onPrototypeNavLinkSizePresetChange,
  onPrototypeNavLinkFontPresetChange,
  onPrototypeNavTintPresetChange,
  onReset,
}: {
  prototypeNavHeightPreset: PrototypeNavHeightPreset;
  prototypeNavLogoId: PrototypeNavLogoId;
  prototypeNavLogoSizePreset: PrototypeNavLogoSizePreset;
  prototypeNavPaddingPreset: PrototypeNavPaddingPreset;
  prototypeNavPaddingXPreset: PrototypeNavPaddingXPreset;
  prototypeNavLinkSpacingPreset: PrototypeNavLinkSpacingPreset;
  prototypeNavLinkSizePreset: PrototypeNavLinkSizePreset;
  prototypeNavLinkFontPreset: PrototypeNavLinkFontPreset;
  prototypeNavTintPreset: PrototypeNavTintPreset;
  onPrototypeNavHeightPresetChange: (
    preset: PrototypeNavHeightPreset
  ) => void;
  onPrototypeNavLogoIdChange: (logoId: PrototypeNavLogoId) => void;
  onPrototypeNavLogoSizePresetChange: (
    preset: PrototypeNavLogoSizePreset
  ) => void;
  onPrototypeNavPaddingPresetChange: (
    preset: PrototypeNavPaddingPreset
  ) => void;
  onPrototypeNavPaddingXPresetChange: (
    preset: PrototypeNavPaddingXPreset
  ) => void;
  onPrototypeNavLinkSpacingPresetChange: (
    preset: PrototypeNavLinkSpacingPreset
  ) => void;
  onPrototypeNavLinkSizePresetChange: (
    preset: PrototypeNavLinkSizePreset
  ) => void;
  onPrototypeNavLinkFontPresetChange: (
    preset: PrototypeNavLinkFontPreset
  ) => void;
  onPrototypeNavTintPresetChange: (preset: PrototypeNavTintPreset) => void;
  onReset: () => void;
}) {
  return (
    <section
      aria-label="Prototype layout controls"
      className="fixed bottom-0 left-0 right-0 z-50 hidden max-h-[46vh] w-full overflow-y-auto border-t border-black/15 bg-[#f7f5f1]/95 text-slate shadow-[0_-12px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:block"
      data-testid="prototype-home-controls"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex flex-wrap items-end gap-3 py-3 sm:gap-4`}
      >
        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Nav height
          <select
            value={prototypeNavHeightPreset}
            onChange={(event) =>
              onPrototypeNavHeightPresetChange(
                event.target.value as PrototypeNavHeightPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavHeightOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Logo
          <select
            value={prototypeNavLogoId}
            onChange={(event) =>
              onPrototypeNavLogoIdChange(
                event.target.value as PrototypeNavLogoId
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {prototypeNavLogoOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Logo size
          <select
            value={prototypeNavLogoSizePreset}
            onChange={(event) =>
              onPrototypeNavLogoSizePresetChange(
                event.target.value as PrototypeNavLogoSizePreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavLogoSizeOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Y pad
          <select
            value={prototypeNavPaddingPreset}
            onChange={(event) =>
              onPrototypeNavPaddingPresetChange(
                event.target.value as PrototypeNavPaddingPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavPaddingOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          X pad
          <select
            value={prototypeNavPaddingXPreset}
            onChange={(event) =>
              onPrototypeNavPaddingXPresetChange(
                event.target.value as PrototypeNavPaddingXPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavPaddingXOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Link gap
          <select
            value={prototypeNavLinkSpacingPreset}
            onChange={(event) =>
              onPrototypeNavLinkSpacingPresetChange(
                event.target.value as PrototypeNavLinkSpacingPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavLinkSpacingOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Link size
          <select
            value={prototypeNavLinkSizePreset}
            onChange={(event) =>
              onPrototypeNavLinkSizePresetChange(
                event.target.value as PrototypeNavLinkSizePreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavLinkSizeOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Link font
          <select
            value={prototypeNavLinkFontPreset}
            onChange={(event) =>
              onPrototypeNavLinkFontPresetChange(
                event.target.value as PrototypeNavLinkFontPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavLinkFontOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Nav tint
          <select
            value={prototypeNavTintPreset}
            onChange={(event) =>
              onPrototypeNavTintPresetChange(
                event.target.value as PrototypeNavTintPreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(prototypeNavTintOptions).map(
              ([preset, option]) => (
                <option key={preset} value={preset}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <button
          type="button"
          title="Reset prototype layout controls"
          aria-label="Reset prototype layout controls"
          onClick={onReset}
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate/25 bg-white text-slate transition-colors hover:border-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

type HomePrototypeProps = {
  biographyArticles?: ArticleFrontend[];
  blogEntries?: BlogEntryFrontend[];
  collectionEntries?: CollectionFrontend[];
  shopProducts?: SimpleProduct[];
  shopHasLoadError?: boolean;
};

export function HomePrototype({
  biographyArticles = [],
  blogEntries = [],
  collectionEntries = [],
  shopProducts = [],
  shopHasLoadError = false,
}: HomePrototypeProps) {
  const [prototypeNavHeightPreset, setPrototypeNavHeightPreset] =
    useState<PrototypeNavHeightPreset>(DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET);
  const [prototypeNavLogoId, setPrototypeNavLogoId] =
    useState<PrototypeNavLogoId>(DEFAULT_PROTOTYPE_NAV_LOGO_ID);
  const [prototypeNavLogoSizePreset, setPrototypeNavLogoSizePreset] =
    useState<PrototypeNavLogoSizePreset>(
      DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET
    );
  const [prototypeNavPaddingPreset, setPrototypeNavPaddingPreset] =
    useState<PrototypeNavPaddingPreset>(DEFAULT_PROTOTYPE_NAV_PADDING_PRESET);
  const [prototypeNavPaddingXPreset, setPrototypeNavPaddingXPreset] =
    useState<PrototypeNavPaddingXPreset>(
      DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET
    );
  const [prototypeNavLinkSpacingPreset, setPrototypeNavLinkSpacingPreset] =
    useState<PrototypeNavLinkSpacingPreset>(
      DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET
    );
  const [prototypeNavLinkSizePreset, setPrototypeNavLinkSizePreset] =
    useState<PrototypeNavLinkSizePreset>(
      DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET
    );
  const [prototypeNavLinkFontPreset, setPrototypeNavLinkFontPreset] =
    useState<PrototypeNavLinkFontPreset>(
      DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET
    );
  const [prototypeNavTintPreset, setPrototypeNavTintPreset] =
    useState<PrototypeNavTintPreset>(DEFAULT_PROTOTYPE_NAV_TINT_PRESET);

  const prototypeStyle = useMemo(
    (): PrototypeHomeStyle => ({
      "--prototype-home-frame-max": frameWidth[DEFAULT_FRAME_PRESET],
      "--prototype-home-heading-scale": fontScale[DEFAULT_FONT_PRESET],
      "--prototype-home-alt-bg":
        alternateBackgroundOptions[DEFAULT_ALTERNATE_BACKGROUND_PRESET].value,
    }),
    []
  );

  const resetControls = () => {
    setPrototypeNavHeightPreset(DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET);
    setPrototypeNavLogoId(DEFAULT_PROTOTYPE_NAV_LOGO_ID);
    setPrototypeNavLogoSizePreset(DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET);
    setPrototypeNavPaddingPreset(DEFAULT_PROTOTYPE_NAV_PADDING_PRESET);
    setPrototypeNavPaddingXPreset(DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET);
    setPrototypeNavLinkSpacingPreset(
      DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET
    );
    setPrototypeNavLinkSizePreset(DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET);
    setPrototypeNavLinkFontPreset(DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET);
    setPrototypeNavTintPreset(DEFAULT_PROTOTYPE_NAV_TINT_PRESET);
  };

  useEffect(() => {
    const root = document.documentElement;
    const linkFont = prototypeNavLinkFontOptions[prototypeNavLinkFontPreset];

    root.style.setProperty(
      "--prototype-main-nav-height",
      prototypeNavHeightOptions[prototypeNavHeightPreset].value
    );
    root.style.setProperty(
      "--prototype-main-nav-logo-height",
      prototypeNavLogoSizeOptions[prototypeNavLogoSizePreset].height
    );
    root.style.setProperty(
      "--prototype-main-nav-logo-width",
      prototypeNavLogoSizeOptions[prototypeNavLogoSizePreset].width
    );
    root.style.setProperty(
      "--prototype-main-nav-mobile-logo-height",
      prototypeNavLogoSizeOptions[prototypeNavLogoSizePreset].mobileHeight
    );
    root.style.setProperty(
      "--prototype-main-nav-mobile-logo-width",
      prototypeNavLogoSizeOptions[prototypeNavLogoSizePreset].mobileWidth
    );
    root.style.setProperty(
      "--prototype-main-nav-padding-y",
      prototypeNavPaddingOptions[prototypeNavPaddingPreset].value
    );
    root.style.setProperty(
      "--prototype-main-nav-padding-x",
      prototypeNavPaddingXOptions[prototypeNavPaddingXPreset].value
    );
    root.style.setProperty(
      "--prototype-main-nav-link-gap",
      prototypeNavLinkSpacingOptions[prototypeNavLinkSpacingPreset].value
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-size",
      prototypeNavLinkSizeOptions[prototypeNavLinkSizePreset].value
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-family",
      linkFont.family
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-weight",
      linkFont.weight
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-style",
      linkFont.style
    );
    root.style.setProperty(
      "--prototype-main-nav-link-letter-spacing",
      linkFont.letterSpacing
    );
    root.style.setProperty(
      "--prototype-main-nav-bg",
      prototypeNavTintOptions[prototypeNavTintPreset].value
    );
    root.dataset.prototypeMainNavLogo = prototypeNavLogoId;

    return () => {
      root.style.removeProperty("--prototype-main-nav-height");
      root.style.removeProperty("--prototype-main-nav-logo-height");
      root.style.removeProperty("--prototype-main-nav-logo-width");
      root.style.removeProperty("--prototype-main-nav-mobile-logo-height");
      root.style.removeProperty("--prototype-main-nav-mobile-logo-width");
      root.style.removeProperty("--prototype-main-nav-padding-y");
      root.style.removeProperty("--prototype-main-nav-padding-x");
      root.style.removeProperty("--prototype-main-nav-link-gap");
      root.style.removeProperty("--prototype-main-nav-link-font-size");
      root.style.removeProperty("--prototype-main-nav-link-font-family");
      root.style.removeProperty("--prototype-main-nav-link-font-weight");
      root.style.removeProperty("--prototype-main-nav-link-font-style");
      root.style.removeProperty("--prototype-main-nav-link-letter-spacing");
      root.style.removeProperty("--prototype-main-nav-bg");
      delete root.dataset.prototypeMainNavLogo;
    };
  }, [
    prototypeNavHeightPreset,
    prototypeNavLinkSpacingPreset,
    prototypeNavLinkSizePreset,
    prototypeNavLogoId,
    prototypeNavLogoSizePreset,
    prototypeNavPaddingPreset,
    prototypeNavPaddingXPreset,
    prototypeNavLinkFontPreset,
    prototypeNavTintPreset,
  ]);

  return (
    <div
      className="prototype-home-shell prototype-home-primary-bg w-full text-slate lg:pb-28"
      data-font-preset={DEFAULT_FONT_PRESET}
      data-frame-preset={DEFAULT_FRAME_PRESET}
      data-alternate-background-preset={DEFAULT_ALTERNATE_BACKGROUND_PRESET}
      data-testid="prototype-home"
      style={prototypeStyle}
    >
      <style>{prototypeHomeTypographyCss}</style>
      <PrototypeHomeControlRail
        prototypeNavHeightPreset={prototypeNavHeightPreset}
        prototypeNavLogoId={prototypeNavLogoId}
        prototypeNavLogoSizePreset={prototypeNavLogoSizePreset}
        prototypeNavPaddingPreset={prototypeNavPaddingPreset}
        prototypeNavPaddingXPreset={prototypeNavPaddingXPreset}
        prototypeNavLinkSpacingPreset={prototypeNavLinkSpacingPreset}
        prototypeNavLinkSizePreset={prototypeNavLinkSizePreset}
        prototypeNavLinkFontPreset={prototypeNavLinkFontPreset}
        prototypeNavTintPreset={prototypeNavTintPreset}
        onPrototypeNavHeightPresetChange={setPrototypeNavHeightPreset}
        onPrototypeNavLogoIdChange={setPrototypeNavLogoId}
        onPrototypeNavLogoSizePresetChange={setPrototypeNavLogoSizePreset}
        onPrototypeNavPaddingPresetChange={setPrototypeNavPaddingPreset}
        onPrototypeNavPaddingXPresetChange={setPrototypeNavPaddingXPreset}
        onPrototypeNavLinkSpacingPresetChange={setPrototypeNavLinkSpacingPreset}
        onPrototypeNavLinkSizePresetChange={setPrototypeNavLinkSizePreset}
        onPrototypeNavLinkFontPresetChange={setPrototypeNavLinkFontPreset}
        onPrototypeNavTintPresetChange={setPrototypeNavTintPreset}
        onReset={resetControls}
      />
      {prototypeSections.map((section) => {
        if (section.id === "biography") {
          return (
            <BiographyPrototypeSection
              key={section.id}
              articles={biographyArticles}
            />
          );
        }

        if (section.id === "blog") {
          return <BlogPrototypeSection key={section.id} blogs={blogEntries} />;
        }

        if (section.id === "collections") {
          return (
            <CollectionPrototypeSection
              key={section.id}
              collections={collectionEntries}
            />
          );
        }

        if (section.id === "shop") {
          return (
            <ShopPrototypeSection
              key={section.id}
              products={shopProducts}
              hasLoadError={shopHasLoadError}
              productSizePreset={DEFAULT_PRODUCT_SIZE_PRESET}
            />
          );
        }

        if (section.id === "project") {
          return <ProjectPrototypeSection key={section.id} />;
        }

        return (
          <PrototypeSectionPlaceholder
            key={section.id}
            id={section.id}
            label={section.label}
            title={section.title}
            description={section.description}
            tone={section.tone}
            className={section.className}
          />
        );
      })}
    </div>
  );
}
