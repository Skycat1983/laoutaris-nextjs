import { ShopProductsLoader } from "@/components/loaders/viewLoaders/ShopProductsLoader";
import { ShopFiltersState, ShopSearchParams } from "@/lib/data/types/shopTypes";
import Image from "next/image";

// TODO: Move Shopify credentials to .env.local before pushing to GitHub
// Credentials are in: src/lib/config/shopifyConfig.ts

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  const filters: ShopFiltersState = {
    artstyle: searchParams.artstyle || "all-style",
    medium: searchParams.medium || "all-medium",
    surface: searchParams.surface || "all-surface",
    decade: searchParams.decade || "all-epochs",
    showOriginals: searchParams.showOriginals !== "false",
    showPrints: searchParams.showPrints !== "false",
    showBooks: searchParams.showBooks !== "false",
  };

  return (
    <main className="flex min-h-screen max-w-screen flex-col items-center justify-start">
      <div className="w-full max-w-7xl">
        {/* Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16">
          {/* Image Section */}
          <div className="relative w-full h-[400px] lg:h-[600px]">
            <Image
              src="https://res.cloudinary.com/dzncmfirr/image/upload/e_grayscale/v1706776928/studio-thumbnails/JRL_studio1_007_qacibz.jpg"
              alt="Art Sale Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="bg-gray-50 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-6xl mb-4 text-gray-900">
                Art for Sale
              </h1>
              <div className="w-24 h-1 bg-gray-900 mb-8"></div>

              <h2 className="text-2xl lg:text-3xl mb-6 text-gray-800">
                Supporting our mission
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We would like to reiterate that my grandfather&apos;s artwork
                  is freely available, long term, to any establishment that can
                  put it on display to the public.
                </p>
                <p>
                  However, even if you aren&apos;t a gallery curator, you can
                  still own a piece of his art. We have a selection of books,
                  prints, and original artworks for sale. Limited edition print
                  runs are fixed at 100 reproductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Loader */}
        <ShopProductsLoader initialFilters={filters} />
      </div>
    </main>
  );
}
