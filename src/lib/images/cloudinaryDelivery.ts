const CLOUDINARY_DELIVERY_HOST = "res.cloudinary.com";
const CLOUDINARY_DELIVERY_CLOUD = "dzncmfirr";
const CLOUDINARY_UPLOAD_PATH_PREFIX = `/${CLOUDINARY_DELIVERY_CLOUD}/image/upload/`;

export const CLOUDINARY_DELIVERY_TRANSFORMS = {
  original: "",
  card: "w_300,q_auto",
  galleryList: "w_600,q_auto",
  adminPreview: "w_200,h_200,c_fill",
  blogHero: "w_1200,q_auto",
  blogFeatureHero: "w_1600,q_auto",
  blogFeatureCard: "w_600,q_auto",
  blogGridCard: "w_800,q_auto",
  blogListThumbnail: "w_200,q_auto",
} as const;

export type CloudinaryDeliveryVariant =
  keyof typeof CLOUDINARY_DELIVERY_TRANSFORMS;

const parseDeliveryUrl = (src: string): URL | null => {
  try {
    return new URL(src);
  } catch {
    return null;
  }
};

const isConfiguredCloudinaryUploadUrl = (url: URL): boolean => {
  return (
    url.protocol === "https:" &&
    url.hostname === CLOUDINARY_DELIVERY_HOST &&
    !url.username &&
    !url.password &&
    !url.port &&
    url.pathname.startsWith(CLOUDINARY_UPLOAD_PATH_PREFIX)
  );
};

export const getCloudinaryDeliveryUrl = (
  src: string | null | undefined,
  variant: CloudinaryDeliveryVariant = "original"
): string => {
  if (!src) {
    return "";
  }

  const transform = CLOUDINARY_DELIVERY_TRANSFORMS[variant];

  if (!transform) {
    return src;
  }

  const parsedUrl = parseDeliveryUrl(src);

  if (!parsedUrl || !isConfiguredCloudinaryUploadUrl(parsedUrl)) {
    return src;
  }

  parsedUrl.pathname = parsedUrl.pathname.replace(
    CLOUDINARY_UPLOAD_PATH_PREFIX,
    `${CLOUDINARY_UPLOAD_PATH_PREFIX}${transform}/`
  );

  return parsedUrl.toString();
};
