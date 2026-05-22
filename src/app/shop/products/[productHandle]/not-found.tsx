import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function ShopProductNotFound() {
  return (
    <PublicDetailNotFound
      title="Product not found"
      message="The product you are looking for is not available in the shop."
      returnHref="/shop/products"
      returnLabel="Browse shop"
    />
  );
}
