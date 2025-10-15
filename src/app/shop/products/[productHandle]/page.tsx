import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type PageProps = {
  params: {
    productHandle: string;
  };
};

const fetchArtworkIfLinked = async (
  product: SimpleProduct
): Promise<ArtworkFrontend | null> => {
  if (!product.mongodbArtworkId) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/artworks/${product.mongodbArtworkId}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching linked artwork in ProductPage: ", error);
    return null;
  }
};

const fetchArtworksInBook = async (
  artworkIds: string[]
): Promise<ArtworkFrontend[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const artworks = await Promise.all(
      artworkIds.map((id) =>
        fetch(`${baseUrl}/api/artworks/${id}`, {
          cache: "no-store",
        }).then((res) => (res.ok ? res.json() : null))
      )
    );
    return artworks.filter(Boolean);
  } catch (error) {
    console.error("Error fetching artworks in book in ProductPage: ", error);
    return [];
  }
};

export default async function ProductPage({ params }: PageProps) {
  const { productHandle } = params;

  // Fetch Shopify product
  const product = await getProductByHandle(productHandle);

  if (!product) {
    notFound();
  }

  // Determine product type and fetch related data
  const isBook =
    product.featuredArtworkIds && product.featuredArtworkIds.length > 0;
  const linkedArtwork = isBook ? null : await fetchArtworkIfLinked(product);
  const bookArtworks = isBook
    ? await fetchArtworksInBook(product.featuredArtworkIds!)
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.altText || product.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-sm text-gray-500 uppercase">{product.vendor}</p>
          </div>

          <div className="text-3xl font-semibold">
            {product.currencyCode} {product.price}
            {product.compareAtPrice && (
              <span className="ml-4 text-xl text-gray-400 line-through">
                {product.currencyCode} {product.compareAtPrice}
              </span>
            )}
          </div>

          {product.description && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Buy Button Placeholder */}
          <button
            className="w-full bg-black text-white py-4 px-8 rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.availableForSale}
          >
            {product.availableForSale ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* Link to Artwork Page (if single artwork) */}
          {linkedArtwork && (
            <div className="border-t pt-6">
              <Link
                href={`/artwork/${linkedArtwork._id}`}
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                View Full Artwork Details →
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                See comprehensive information, colors, collection context, and
                more
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Book: Show Featured Artworks */}
      {isBook && bookArtworks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">
            Features {bookArtworks.length} Artworks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookArtworks.map((artwork) => (
              <Link
                key={artwork._id}
                href={`/artwork/${artwork._id}`}
                className="group"
              >
                <div className="relative aspect-square mb-2 overflow-hidden rounded-md">
                  <Image
                    src={artwork.image.secure_url}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-sm font-medium group-hover:underline">
                  {artwork.title}
                </p>
                <p className="text-xs text-gray-500">{artwork.decade}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
