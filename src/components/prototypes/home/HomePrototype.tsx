"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import { PrototypeSectionPlaceholder } from "./PrototypeSectionPlaceholder";
import { BlogPrototypeSection } from "./BlogPrototypeSection";
import { BiographyPrototypeSection } from "./BiographyPrototypeSection";
import { CollectionPrototypeSection } from "./CollectionPrototypeSection";
import { ProjectPrototypeSection } from "./ProjectPrototypeSection";
import {
  shopProductSizePresets,
  ShopPrototypeSection,
  type ProductSizePreset,
} from "./ShopPrototypeSection";
import { prototypeSectionFrameClassName } from "./prototypeHomeLayout";
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

const fontPresetOptions: Array<{
  id: PrototypeFontPreset;
  label: string;
}> = [
  { id: "standard", label: "Default type" },
  { id: "smaller", label: "Smaller type" },
  { id: "compact", label: "Compact type" },
];

function PrototypeHomeControlRail({
  framePreset,
  fontPreset,
  productSizePreset,
  alternateBackgroundPreset,
  onFramePresetChange,
  onFontPresetChange,
  onProductSizePresetChange,
  onAlternateBackgroundPresetChange,
  onReset,
}: {
  framePreset: PrototypeFramePreset;
  fontPreset: PrototypeFontPreset;
  productSizePreset: ProductSizePreset;
  alternateBackgroundPreset: AlternateBackgroundPreset;
  onFramePresetChange: (preset: PrototypeFramePreset) => void;
  onFontPresetChange: (preset: PrototypeFontPreset) => void;
  onProductSizePresetChange: (preset: ProductSizePreset) => void;
  onAlternateBackgroundPresetChange: (
    preset: AlternateBackgroundPreset
  ) => void;
  onReset: () => void;
}) {
  const activeAlternateBackground =
    alternateBackgroundOptions[alternateBackgroundPreset];

  return (
    <section
      aria-label="Prototype layout controls"
      className="fixed bottom-0 left-0 right-0 z-50 hidden w-full border-t border-black/15 bg-[#f7f5f1]/95 text-slate shadow-[0_-12px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:block"
      data-testid="prototype-home-controls"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex flex-wrap items-end gap-3 py-3 sm:gap-4`}
      >
        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Frame
          <select
            value={framePreset}
            onChange={(event) =>
              onFramePresetChange(event.target.value as PrototypeFramePreset)
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            <option value="wide">Wide frame</option>
            <option value="inset">Inset sides</option>
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Headings
          <select
            value={fontPreset}
            onChange={(event) =>
              onFontPresetChange(event.target.value as PrototypeFontPreset)
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {fontPresetOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Shop items
          <select
            value={productSizePreset}
            onChange={(event) =>
              onProductSizePresetChange(
                event.target.value as ProductSizePreset
              )
            }
            className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
          >
            {Object.entries(shopProductSizePresets).map(([preset, option]) => (
              <option key={preset} value={preset}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[150px] flex-1 flex-col gap-1 font-archivo text-[11px] uppercase tracking-[0.14em] text-slate/70 sm:max-w-[210px]">
          Alt bg
          <span className="relative block">
            <span
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 border border-slate/20"
              style={{ backgroundColor: activeAlternateBackground.value }}
              aria-hidden="true"
            />
            <select
              value={alternateBackgroundPreset}
              onChange={(event) =>
                onAlternateBackgroundPresetChange(
                  event.target.value as AlternateBackgroundPreset
                )
              }
              className="h-10 w-full appearance-none border border-slate/25 bg-white px-3 pl-9 font-archivo text-sm normal-case tracking-normal text-slate shadow-sm focus:outline-none focus:ring-2 focus:ring-slate"
            >
              {Object.entries(alternateBackgroundOptions).map(
                ([preset, option]) => (
                  <option key={preset} value={preset}>
                    {option.label}
                  </option>
                )
              )}
            </select>
          </span>
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
  const [framePreset, setFramePreset] =
    useState<PrototypeFramePreset>(DEFAULT_FRAME_PRESET);
  const [fontPreset, setFontPreset] =
    useState<PrototypeFontPreset>(DEFAULT_FONT_PRESET);
  const [productSizePreset, setProductSizePreset] =
    useState<ProductSizePreset>(DEFAULT_PRODUCT_SIZE_PRESET);
  const [alternateBackgroundPreset, setAlternateBackgroundPreset] =
    useState<AlternateBackgroundPreset>(DEFAULT_ALTERNATE_BACKGROUND_PRESET);

  const prototypeStyle = useMemo(
    (): PrototypeHomeStyle => ({
      "--prototype-home-frame-max": frameWidth[framePreset],
      "--prototype-home-heading-scale": fontScale[fontPreset],
      "--prototype-home-alt-bg":
        alternateBackgroundOptions[alternateBackgroundPreset].value,
    }),
    [alternateBackgroundPreset, fontPreset, framePreset]
  );

  const resetControls = () => {
    setFramePreset(DEFAULT_FRAME_PRESET);
    setFontPreset(DEFAULT_FONT_PRESET);
    setProductSizePreset(DEFAULT_PRODUCT_SIZE_PRESET);
    setAlternateBackgroundPreset(DEFAULT_ALTERNATE_BACKGROUND_PRESET);
  };

  return (
    <div
      className="prototype-home-shell prototype-home-primary-bg w-full text-slate lg:pb-28"
      data-font-preset={fontPreset}
      data-frame-preset={framePreset}
      data-alternate-background-preset={alternateBackgroundPreset}
      data-testid="prototype-home"
      style={prototypeStyle}
    >
      <style>{prototypeHomeTypographyCss}</style>
      <PrototypeHomeControlRail
        framePreset={framePreset}
        fontPreset={fontPreset}
        productSizePreset={productSizePreset}
        alternateBackgroundPreset={alternateBackgroundPreset}
        onFramePresetChange={setFramePreset}
        onFontPresetChange={setFontPreset}
        onProductSizePresetChange={setProductSizePreset}
        onAlternateBackgroundPresetChange={setAlternateBackgroundPreset}
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
              productSizePreset={productSizePreset}
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
