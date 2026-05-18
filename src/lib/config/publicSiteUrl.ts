const PUBLIC_SITE_ORIGIN = "https://laoutaris-nextjs.vercel.app";

export const getPublicSiteUrl = () => new URL(PUBLIC_SITE_ORIGIN);

export const getPublicSitePathUrl = (path: string) =>
  new URL(path, getPublicSiteUrl()).toString();
