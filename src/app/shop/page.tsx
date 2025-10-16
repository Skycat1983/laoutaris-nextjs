import { redirect } from "next/navigation";

// Redirect /shop to /shop/products
export default function Shop() {
  redirect("/shop/products");
}
