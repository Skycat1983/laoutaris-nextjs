import { ShopPrototypeSection } from "@/components/prototypes/home/ShopPrototypeSection";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const HOME_SHOP_PRODUCT_LIMIT = 8;

const logger = createServerLogger({
  component: "ShopSectionLoader",
  operation: "public.shop_section.loader",
  surface: "server_loader",
});

export async function ShopSectionLoader() {
  try {
    const result = await getShopProductList({
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    });

    return (
      <ShopPrototypeSection
        products={result.data.slice(0, HOME_SHOP_PRODUCT_LIMIT)}
        hasLoadError={false}
        productSizePreset="feature"
        useAlternateBackground={false}
      />
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.shop_section.failed", { error });

    return (
      <ShopPrototypeSection
        products={[]}
        hasLoadError
        productSizePreset="feature"
        useAlternateBackground={false}
      />
    );
  }
}
