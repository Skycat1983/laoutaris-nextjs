import type { MetadataRoute } from "next";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/api"],
    },
    sitemap: getPublicSitePathUrl("/sitemap.xml"),
  };
}
