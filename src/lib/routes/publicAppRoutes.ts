export const publicAppRoutes = {
  home: "/",
  artwork: "/artwork",
  biography: "/biography",
  collections: "/collections",
  blog: "/blog",
  project: "/project",
  shop: "/shop",
  shopProducts: "/shop/products",
  search: "/search",
  privacy: "/privacy",
  terms: "/terms",
  signIn: "/sign-in",
} as const;

export type PublicAppRoute =
  (typeof publicAppRoutes)[keyof typeof publicAppRoutes];

const encodedDetailPath = (basePath: PublicAppRoute, segment: string) =>
  `${basePath}/${encodeURIComponent(segment)}`;

export const articleDetailPath = (slug: string) =>
  encodedDetailPath(publicAppRoutes.biography, slug);

export const blogDetailPath = (slug: string) =>
  encodedDetailPath(publicAppRoutes.blog, slug);

export const artworkDetailPath = (artworkId: string) =>
  encodedDetailPath(publicAppRoutes.artwork, artworkId);

export const productDetailPath = (productHandle: string) =>
  encodedDetailPath(publicAppRoutes.shopProducts, productHandle);

export const collectionDetailPath = (collectionSlug: string) =>
  encodedDetailPath(publicAppRoutes.collections, collectionSlug);

export const collectionArtworkPath = (
  collectionSlug: string,
  artworkId: string
) => `${collectionDetailPath(collectionSlug)}/${encodeURIComponent(artworkId)}`;
