"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import {
  prototypeImageSkeletonClassName,
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type ShopPrototypeSectionProps = {
  products: SimpleProduct[];
  hasLoadError?: boolean;
  productSizePreset?: ProductSizePreset;
  useAlternateBackground?: boolean;
};

const SHOP_ROUTE = "/shop/products";

const shopCategoryPills = ["Originals", "Prints", "Books"] as const;
type ShopCategory = (typeof shopCategoryPills)[number];

const sectionHeadingStyle = prototypeHeadingStyle({
  base: "2.75rem",
  sm: "3.5rem",
  lg: "4.5rem",
});

export const shopProductSizePresets = {
  large: {
    label: "Large",
    cardClass:
      "w-[82vw] min-w-[280px] max-w-[360px] sm:w-[330px] lg:w-[clamp(300px,18vw,360px)] 2xl:w-[clamp(340px,18vw,390px)]",
    imageSizes:
      "(max-width: 640px) 82vw, (max-width: 1024px) 330px, (max-width: 1536px) 360px, 18vw",
  },
  larger: {
    label: "Larger",
    cardClass:
      "w-[86vw] min-w-[310px] max-w-[410px] sm:w-[370px] lg:w-[clamp(340px,21vw,430px)] 2xl:w-[clamp(390px,21vw,470px)]",
    imageSizes:
      "(max-width: 640px) 86vw, (max-width: 1024px) 370px, (max-width: 1536px) 430px, 21vw",
  },
  feature: {
    label: "Feature",
    cardClass:
      "w-[88vw] min-w-[320px] max-w-[430px] sm:w-[390px] lg:w-[clamp(360px,22vw,460px)] 2xl:w-[clamp(420px,22vw,500px)]",
    imageSizes:
      "(max-width: 640px) 88vw, (max-width: 1024px) 390px, (max-width: 1536px) 460px, 22vw",
  },
} as const;

export type ProductSizePreset = keyof typeof shopProductSizePresets;

const formatProductPrice = (product: SimpleProduct) => {
  const amount = Number.parseFloat(product.price);

  if (!Number.isFinite(amount)) {
    return `${product.currencyCode} ${product.price}`;
  }

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: product.currencyCode,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${product.currencyCode} ${amount.toFixed(2)}`;
  }
};

const getProductMeta = (product: SimpleProduct) => {
  const productType = product.productType.trim();
  if (productType) return productType;

  return product.tags.find((tag) => tag.trim()) ?? "Archive product";
};

const getProductTags = (product: SimpleProduct) =>
  product.tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");

const productMatchesCategory = (
  product: SimpleProduct,
  category: ShopCategory
) => {
  const categoryToken = category.toLowerCase().replace(/s$/, "");
  const productTerms = [product.productType, ...product.tags]
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);

  return productTerms.some((term) => term.includes(categoryToken));
};

function ShopProductImage({
  product,
  sizes,
  className = "object-cover transition-transform duration-300 group-hover:scale-[1.02]",
  loading = "lazy",
}: {
  product: SimpleProduct;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  return product.image ? (
    <Image
      src={product.image.url}
      alt={product.image.altText || product.title}
      fill
      className={`z-10 ${className}`}
      sizes={sizes}
      loading={loading}
    />
  ) : (
    <div
      className={`${prototypeImageSkeletonClassName} flex h-full w-full items-center justify-center px-6 text-center font-archivo text-sm text-slate/45`}
    >
      Image pending
    </div>
  );
}

function ShopProductCardDetails({
  product,
  showTags = true,
  compact = false,
}: {
  product: SimpleProduct;
  showTags?: boolean;
  compact?: boolean;
}) {
  const tags = getProductTags(product);

  return (
    <div
      className={
        compact ? "flex flex-col p-5" : "flex flex-1 flex-col gap-4 p-4 sm:p-5"
      }
    >
      <div>
        <p className="prototype-home-accent-text line-clamp-2 break-words font-archivo text-xs uppercase tracking-[0.16em]">
          {getProductMeta(product)}
        </p>
        <h3
          className={`line-clamp-2 break-words font-cormorant text-2xl font-semibold leading-tight text-slate ${
            compact ? "mt-1" : "mt-2"
          }`}
        >
          {product.title}
        </h3>
      </div>

      {showTags && tags && (
        <p className="line-clamp-2 break-words font-archivo text-xs uppercase leading-5 text-slate/50">
          {tags}
        </p>
      )}

      <div
        className={`flex items-center justify-between gap-3 border-t border-slate/10 ${
          compact ? "mt-5 pt-3" : "mt-auto pt-4"
        }`}
      >
        <span className="prototype-home-accent-text font-archivo text-sm">
          {formatProductPrice(product)}
        </span>
        <span className="inline-flex items-center gap-1 font-archivo text-xs uppercase tracking-[0.1em] text-slate/60">
          Details
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function MobileShopDeck({ products }: { products: SimpleProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>("Originals");
  const displayedProducts = products.filter((product) =>
    productMatchesCategory(product, selectedCategory)
  );
  const progress =
    displayedProducts.length > 0
      ? ((activeIndex + 1) / displayedProducts.length) * 100
      : 0;

  const selectCategory = (category: ShopCategory) => {
    setSelectedCategory(category);
    setActiveIndex(0);
    cardRefs.current = [];
    railRef.current?.scrollTo?.({ left: 0, behavior: "smooth" });
  };

  const focusProduct = (nextIndex: number) => {
    if (displayedProducts.length === 0) return;

    setActiveIndex(nextIndex);
    cardRefs.current[nextIndex]?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const updateActiveFromScroll = () => {
    const rail = railRef.current;
    if (!rail) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    const closestIndex = cardRefs.current.reduce(
      (closest, card, index) => {
        if (!card) return closest;

        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - railCenter);
        return distance < closest.distance ? { distance, index } : closest;
      },
      { distance: Number.POSITIVE_INFINITY, index: activeIndex }
    );

    if (closestIndex.index !== activeIndex) {
      setActiveIndex(closestIndex.index);
    }
  };

  const showPrevious = () => {
    if (displayedProducts.length === 0) return;

    focusProduct(
      activeIndex === 0 ? displayedProducts.length - 1 : activeIndex - 1
    );
  };

  const showNext = () => {
    if (displayedProducts.length === 0) return;

    focusProduct((activeIndex + 1) % displayedProducts.length);
  };

  return (
    <div className="md:hidden" data-testid="prototype-mobile-shop">
      <div
        className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Shop product categories"
        role="tablist"
      >
        {shopCategoryPills.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              id={`prototype-mobile-shop-tab-${category.toLowerCase()}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="prototype-mobile-shop-panel"
              onClick={() => selectCategory(category)}
              className={`shrink-0 rounded-full px-7 py-3 text-center font-cormorant text-lg font-semibold leading-none shadow-[inset_0_0_0_1px_#d4d4d4] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate ${
                isSelected
                  ? "bg-neutral-900 text-white shadow-[inset_0_0_0_1px_#171717]"
                  : "bg-white/70 text-neutral-700 hover:bg-white hover:text-neutral-950"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        id="prototype-mobile-shop-panel"
        role="tabpanel"
        aria-labelledby={`prototype-mobile-shop-tab-${selectedCategory.toLowerCase()}`}
        className="relative -mx-4 mt-5 overflow-hidden"
        aria-label="Mobile shop product carousel"
        data-testid="prototype-mobile-shop-carousel"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") showPrevious();
          if (event.key === "ArrowRight") showNext();
        }}
      >
        <button
          type="button"
          aria-label="Show previous shop product"
          title="Show previous shop product"
          disabled={displayedProducts.length < 2}
          onClick={showPrevious}
          className="absolute left-8 top-[245px] z-30 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 shadow-[0_12px_24px_rgba(0,0,0,0.14)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ArrowLeft aria-hidden="true" className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Show next shop product"
          title="Show next shop product"
          disabled={displayedProducts.length < 2}
          onClick={showNext}
          className="absolute right-8 top-[245px] z-30 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 shadow-[0_12px_24px_rgba(0,0,0,0.14)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ArrowRight aria-hidden="true" className="h-6 w-6" />
        </button>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[14vw] pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateActiveFromScroll}
          data-testid="prototype-mobile-shop-rail"
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <Link
                  key={product.id}
                  ref={(card) => {
                    cardRefs.current[index] = card;
                  }}
                  href={`/shop/products/${product.handle}`}
                  className={`group flex w-[72vw] min-w-[270px] max-w-[310px] shrink-0 snap-center flex-col overflow-hidden bg-white shadow-[0_22px_44px_rgba(0,0,0,0.14)] transition-[box-shadow,opacity,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate ${
                    isActive
                      ? "opacity-100"
                      : "opacity-90 hover:opacity-100 focus-visible:opacity-100"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                  data-testid={
                    isActive
                      ? "prototype-mobile-shop-featured-card"
                      : "prototype-mobile-shop-card"
                  }
                >
                  <article className="flex h-full flex-col">
                    <div
                      className={`relative h-[330px] ${prototypeImageSkeletonClassName}`}
                    >
                      <ShopProductImage
                        product={product}
                        sizes="(max-width: 768px) 72vw, 310px"
                        loading="eager"
                      />
                    </div>
                    <ShopProductCardDetails
                      product={product}
                      showTags={false}
                      compact
                    />
                  </article>
                </Link>
              );
            })
          ) : (
            <div
              className="flex min-h-[300px] w-full shrink-0 snap-center items-center justify-center px-10 text-center font-archivo text-sm leading-6 text-slate/60"
              data-testid="prototype-mobile-shop-category-empty"
            >
              No {selectedCategory.toLowerCase()} are available in this
              prototype selection.
            </div>
          )}
        </div>
      </div>

      <div
        className="mx-auto mt-1 max-w-[320px] text-center"
        data-testid="prototype-mobile-shop-progress"
      >
        <p className="font-archivo text-xs uppercase tracking-[0.22em] text-neutral-700">
          Swipe to browse
        </p>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-neutral-300">
          <div
            className="h-full rounded-full bg-neutral-900 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function ShopPrototypeSection({
  products,
  hasLoadError = false,
  productSizePreset = "large",
  useAlternateBackground = true,
}: ShopPrototypeSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const hasProducts = products.length > 0;
  const activeProductSize = shopProductSizePresets[productSizePreset];
  const backgroundClassName = useAlternateBackground
    ? "prototype-home-alt-bg"
    : "prototype-home-primary-bg";

  const scrollProducts = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.82, 280),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="shop"
      aria-labelledby="prototype-shop-heading"
      className={`${backgroundClassName} w-full text-slate`}
      data-testid="prototype-shop-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex flex-col gap-6 py-16 sm:py-20 md:gap-10 lg:py-24 2xl:gap-12 2xl:py-28`}
      >
        <div className="grid gap-8 md:grid-cols-[minmax(320px,0.72fr)_auto] md:items-end 2xl:grid-cols-[minmax(420px,0.76fr)_auto] 2xl:gap-12">
          <div className="max-w-4xl">
            <p className={`mb-5 ${prototypeSectionEyebrowClassName}`}>Shop</p>
            <h2
              id="prototype-shop-heading"
              className="prototype-home-section-heading font-cormorant text-4xl font-semibold leading-tight text-slate sm:text-5xl lg:text-6xl"
              style={sectionHeadingStyle}
            >
              Available now
            </h2>
            <p className="mt-7 max-w-xl font-archivo text-base leading-7 text-slate/70 sm:text-lg">
              A curated selection of original works, prints, and publications
              from the Joseph Laoutaris archive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 md:flex-col md:items-end md:justify-end md:gap-9">
            <Link
              href={SHOP_ROUTE}
              className="prototype-home-accent-link border-b pb-2 font-archivo text-sm uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
            >
              View full shop
            </Link>
            <div
              className="hidden items-center gap-3 md:flex"
              aria-label="Shop product rail controls"
            >
              <button
                type="button"
                aria-label="Scroll shop products backward"
                title="Scroll shop products backward"
                disabled={!hasProducts}
                onClick={() => scrollProducts(-1)}
                className="prototype-home-accent-border prototype-home-accent-text flex h-12 w-12 items-center justify-center rounded-full border transition-colors hover:border-slate hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Scroll shop products forward"
                title="Scroll shop products forward"
                disabled={!hasProducts}
                onClick={() => scrollProducts(1)}
                className="prototype-home-accent-border prototype-home-accent-text flex h-12 w-12 items-center justify-center rounded-full border transition-colors hover:border-slate hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {hasProducts ? (
          <>
            <MobileShopDeck products={products} />

            <div className="prototype-home-accent-divider-border hidden border-t md:block" />

            <div className="relative hidden md:block">
              <div
                ref={railRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:gap-5 2xl:gap-6 [&::-webkit-scrollbar]:hidden"
                data-size-preset={productSizePreset}
                data-testid="prototype-shop-product-rail"
              >
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/products/${product.handle}`}
                    className={`group flex ${activeProductSize.cardClass} snap-start flex-col overflow-hidden rounded-[4px] border border-slate/10 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate lg:max-w-none`}
                    data-testid="prototype-shop-product-card"
                  >
                    <article className="flex h-full flex-col">
                      <div
                        className={`relative aspect-[4/5] ${prototypeImageSkeletonClassName}`}
                      >
                        <ShopProductImage
                          product={product}
                          sizes={activeProductSize.imageSizes}
                        />
                      </div>

                      <ShopProductCardDetails product={product} />
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div
            className="prototype-home-accent-divider-border border-y px-4 py-14 text-center"
            data-testid="prototype-shop-empty-state"
          >
            <h3 className="font-cormorant text-3xl font-semibold text-slate">
              {hasLoadError
                ? "Shop preview unavailable"
                : "Shop preview pending"}
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-archivo text-sm leading-6 text-slate/65 sm:text-base">
              {hasLoadError
                ? "Product details could not be loaded for this prototype section."
                : "No shop products are available for this prototype section yet."}
            </p>
            <Link
              href={SHOP_ROUTE}
              className="prototype-home-accent-link mt-7 inline-flex items-center gap-3 border-b pb-2 font-archivo text-sm uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
            >
              View shop page
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="flex items-center gap-5" aria-hidden="true">
          <div className="prototype-home-accent-divider h-px flex-1" />
          <div className="prototype-home-accent-border h-3 w-3 rotate-45 border" />
          <div className="prototype-home-accent-divider h-px flex-1" />
        </div>
      </div>
    </section>
  );
}
