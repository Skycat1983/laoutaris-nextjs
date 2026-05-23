"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import {
  prototypeHeadingStyle,
  prototypeSectionEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type ShopPrototypeSectionProps = {
  products: SimpleProduct[];
  hasLoadError?: boolean;
  productSizePreset?: ProductSizePreset;
};

const SHOP_ROUTE = "/shop/products";

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

export function ShopPrototypeSection({
  products,
  hasLoadError = false,
  productSizePreset = "large",
}: ShopPrototypeSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const hasProducts = products.length > 0;
  const activeProductSize = shopProductSizePresets[productSizePreset];

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
      className="prototype-home-alt-bg w-full text-slate"
      data-testid="prototype-shop-section"
    >
      <div
        className={`${prototypeSectionFrameClassName} flex flex-col gap-10 py-16 sm:py-20 lg:py-24 2xl:gap-12 2xl:py-28`}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.72fr)_auto] lg:items-end 2xl:grid-cols-[minmax(420px,0.76fr)_auto] 2xl:gap-12">
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

          <div className="flex flex-wrap items-center gap-5 lg:flex-col lg:items-end lg:gap-9 lg:justify-end">
            <Link
              href={SHOP_ROUTE}
              className="prototype-home-accent-link border-b pb-2 font-archivo text-sm uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate"
            >
              View full shop
            </Link>
            <div
              className="flex items-center gap-3"
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

        <div className="prototype-home-accent-divider-border border-t" />

        {hasProducts ? (
          <div className="relative">
            <div
              ref={railRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:gap-5 2xl:gap-6 [&::-webkit-scrollbar]:hidden"
              data-size-preset={productSizePreset}
              data-testid="prototype-shop-product-rail"
            >
              {products.map((product) => {
                const tags = getProductTags(product);

                return (
                  <Link
                    key={product.id}
                    href={`/shop/products/${product.handle}`}
                    className={`group flex ${activeProductSize.cardClass} snap-start flex-col overflow-hidden rounded-[4px] border border-slate/10 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate lg:max-w-none`}
                    data-testid="prototype-shop-product-card"
                  >
                    <article className="flex h-full flex-col">
                      <div className="relative aspect-[4/5] bg-[#ebe8e0]">
                        {product.image ? (
                          <Image
                            src={product.image.url}
                            alt={product.image.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes={activeProductSize.imageSizes}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-6 text-center font-archivo text-sm text-slate/45">
                            Image pending
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                        <div>
                          <p className="prototype-home-accent-text line-clamp-2 break-words font-archivo text-xs uppercase">
                            {getProductMeta(product)}
                          </p>
                          <h3 className="mt-2 line-clamp-2 break-words font-cormorant text-2xl font-semibold leading-tight text-slate">
                            {product.title}
                          </h3>
                        </div>

                        {tags && (
                          <p className="line-clamp-2 break-words font-archivo text-xs uppercase leading-5 text-slate/50">
                            {tags}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate/10 pt-4">
                          <span className="prototype-home-accent-text font-archivo text-sm">
                            {formatProductPrice(product)}
                          </span>
                          <span className="inline-flex items-center gap-1 font-archivo text-xs uppercase text-slate/60">
                            Details
                            <ArrowUpRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
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
