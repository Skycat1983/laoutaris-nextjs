import Image from "next/image";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { Skeleton } from "@/components/shadcn/skeleton";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";

interface ProductCardProps {
  product: SimpleProduct;
  variant?: "cover" | "contain";
}

/**
 * ProductCard - Displays a Shopify product
 * @param product - The product to display
 * @param variant - "cover" (default) crops image to fill container, "contain" shows full image maintaining aspect ratio
 */
export const ProductCard = ({
  product,
  variant = "cover",
}: ProductCardProps) => {
  const imageObjectFit =
    variant === "contain" ? "object-contain" : "object-cover";

  return (
    <article className=" text-center overflow-hidden  hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      {product.image ? (
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={product.image.url}
            alt={product.image.altText || product.title}
            fill
            className={imageObjectFit}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="py-8">
        <HorizontalDivider />
      </div>
      {/* {product.vendor && (
        <p className="text-sm text-gray-500">
          {product.vendor.charAt(0).toUpperCase() + product.vendor.slice(1)}
        </p>
      )} */}

      {/* Product Info */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.title}
        </h2>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price should be centered text-center */}
        <div className="flex items-baseline gap-2 mb-4 text-center justify-center">
          <span className="text-sm">
            {parseFloat(product.price).toFixed(2)} {product.currencyCode}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {parseFloat(product.compareAtPrice).toFixed(2)}{" "}
              {product.currencyCode}
            </span>
          )}
        </div>

        {/* Availability */}
        {/* <div className="flex items-center justify-between">
          {product.availableForSale ? (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div> */}
      </div>
    </article>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </article>
  );
};
