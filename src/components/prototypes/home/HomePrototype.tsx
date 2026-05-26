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
  DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET,
  DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET,
  DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET,
  DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET,
  DEFAULT_PROTOTYPE_NAV_LOGO_ID,
  DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET,
  DEFAULT_PROTOTYPE_NAV_PADDING_PRESET,
  DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET,
  DEFAULT_PROTOTYPE_NAV_TINT_PRESET,
  getPrototypeMainNavCssValues,
  prototypeNavHeightOptions,
  prototypeNavLinkFontOptions,
  prototypeNavLinkSizeOptions,
  prototypeNavLinkSpacingOptions,
  prototypeNavLogoOptions,
  prototypeNavLogoSizeOptions,
  prototypeNavPaddingOptions,
  prototypeNavPaddingXOptions,
  prototypeNavTintOptions,
  type PrototypeNavHeightPreset,
  type PrototypeNavLinkFontPreset,
  type PrototypeNavLinkSizePreset,
  type PrototypeNavLinkSpacingPreset,
  type PrototypeNavLogoId,
  type PrototypeNavLogoSizePreset,
  type PrototypeNavPaddingPreset,
  type PrototypeNavPaddingXPreset,
  type PrototypeNavTintPreset,
} from "@/components/modules/navigation/prototypeMainNav/prototypeMainNavControls";
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
    const navCssValues = getPrototypeMainNavCssValues({
      heightPreset: prototypeNavHeightPreset,
      logoSizePreset: prototypeNavLogoSizePreset,
      paddingPreset: prototypeNavPaddingPreset,
      paddingXPreset: prototypeNavPaddingXPreset,
      linkSpacingPreset: prototypeNavLinkSpacingPreset,
      linkSizePreset: prototypeNavLinkSizePreset,
      linkFontPreset: prototypeNavLinkFontPreset,
      tintPreset: prototypeNavTintPreset,
    });

    root.style.setProperty(
      "--prototype-main-nav-height",
      navCssValues.height
    );
    root.style.setProperty(
      "--prototype-main-nav-logo-height",
      navCssValues.logoHeight
    );
    root.style.setProperty(
      "--prototype-main-nav-logo-width",
      navCssValues.logoWidth
    );
    root.style.setProperty(
      "--prototype-main-nav-mobile-logo-height",
      navCssValues.mobileLogoHeight
    );
    root.style.setProperty(
      "--prototype-main-nav-mobile-logo-width",
      navCssValues.mobileLogoWidth
    );
    root.style.setProperty(
      "--prototype-main-nav-padding-y",
      navCssValues.paddingY
    );
    root.style.setProperty(
      "--prototype-main-nav-padding-x",
      navCssValues.paddingX
    );
    root.style.setProperty(
      "--prototype-main-nav-link-gap",
      navCssValues.linkGap
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-size",
      navCssValues.linkFontSize
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-family",
      navCssValues.linkFontFamily
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-weight",
      navCssValues.linkFontWeight
    );
    root.style.setProperty(
      "--prototype-main-nav-link-font-style",
      navCssValues.linkFontStyle
    );
    root.style.setProperty(
      "--prototype-main-nav-link-letter-spacing",
      navCssValues.linkLetterSpacing
    );
    root.style.setProperty(
      "--prototype-main-nav-bg",
      navCssValues.background
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
