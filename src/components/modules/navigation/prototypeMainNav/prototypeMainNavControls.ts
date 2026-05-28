import {
  DEFAULT_PROTOTYPE_NAV_LOGO_ID,
  prototypeNavLogoOptions,
  type PrototypeNavLogoId,
} from "./prototypeNavLogoOptions";

export { DEFAULT_PROTOTYPE_NAV_LOGO_ID, prototypeNavLogoOptions };
export type { PrototypeNavLogoId };

export const prototypeNavHeightOptions = {
  compact: { label: "Compact nav", value: "80px" },
  standard: { label: "Standard nav", value: "96px" },
  gallery: { label: "Gallery nav", value: "112px" },
  tall: { label: "Tall nav", value: "128px" },
} as const;

export const prototypeNavLogoSizeOptions = {
  standard: {
    label: "Standard logo",
    height: "56px",
    width: "260px",
    mobileHeight: "46px",
    mobileWidth: "220px",
  },
  large: {
    label: "Large logo",
    height: "74px",
    width: "340px",
    mobileHeight: "50px",
    mobileWidth: "250px",
  },
  oversized: {
    label: "Oversized logo",
    height: "88px",
    width: "420px",
    mobileHeight: "56px",
    mobileWidth: "280px",
  },
} as const;

export const prototypeNavPaddingOptions = {
  none: { label: "None", value: "0px" },
  tight: { label: "Tight", value: "6px" },
  standard: { label: "Standard", value: "12px" },
  airy: { label: "Airy", value: "18px" },
} as const;

export const prototypeNavPaddingXOptions = {
  none: { label: "None", value: "0px" },
  tight: { label: "Tight", value: "8px" },
  standard: { label: "Standard", value: "16px" },
  wide: { label: "Wide", value: "24px" },
  gallery: { label: "Gallery", value: "32px" },
  edge: { label: "Edge", value: "40px" },
} as const;

export const prototypeNavLinkSpacingOptions = {
  tight: { label: "Tight links", value: "12px" },
  standard: { label: "Standard links", value: "20px" },
  wide: { label: "Wide links", value: "28px" },
  airy: { label: "Airy links", value: "36px" },
  open: { label: "Open links", value: "48px" },
  gallery: { label: "Gallery links", value: "60px" },
  broad: { label: "Broad links", value: "72px" },
  grand: { label: "Grand links", value: "88px" },
  pavilion: { label: "Pavilion links", value: "104px" },
  maximum: { label: "Maximum links", value: "120px" },
} as const;

export const prototypeNavLinkSizeOptions = {
  small: { label: "Small type", value: "14px" },
  standard: { label: "Standard type", value: "16px" },
  gallery: { label: "Gallery type", value: "18px" },
  large: { label: "Large type", value: "20px" },
  oversized: { label: "Oversized type", value: "22px" },
} as const;

const regularPrototypeNavFont = (label: string, family: string) => ({
  label,
  family,
  weight: "400",
  style: "normal",
  letterSpacing: "0",
});

export const prototypeNavLinkFontOptions = {
  "archivo-regular": regularPrototypeNavFont(
    "Archivo Regular",
    "var(--font-archivo), sans-serif"
  ),
  cormorant: regularPrototypeNavFont(
    "Cormorant",
    "var(--font-cormorant), Georgia, serif"
  ),
  crimson: regularPrototypeNavFont(
    "Crimson Text",
    "var(--font-crimson), Georgia, serif"
  ),
  cinzel: regularPrototypeNavFont(
    "Cinzel Decorative",
    "var(--font-cinzel-decorative), Georgia, serif"
  ),
  baskerville: regularPrototypeNavFont(
    "Baskerville",
    'Baskerville, "Baskerville Old Face", "Times New Roman", serif'
  ),
  didot: regularPrototypeNavFont("Didot", 'Didot, "Times New Roman", serif'),
  "bodoni-72": regularPrototypeNavFont(
    "Bodoni 72",
    '"Bodoni 72", "Bodoni 72 Oldstyle", Didot, serif'
  ),
  "big-caslon": regularPrototypeNavFont(
    "Big Caslon",
    '"Big Caslon", "Book Antiqua", Georgia, serif'
  ),
  "hoefler-text": regularPrototypeNavFont(
    "Hoefler Text",
    '"Hoefler Text", Garamond, Georgia, serif'
  ),
  palatino: regularPrototypeNavFont(
    "Palatino",
    'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif'
  ),
  garamond: regularPrototypeNavFont(
    "Garamond",
    'Garamond, "Times New Roman", serif'
  ),
  "iowan-old-style": regularPrototypeNavFont(
    "Iowan Old Style",
    '"Iowan Old Style", Georgia, serif'
  ),
  charter: regularPrototypeNavFont(
    "Charter",
    'Charter, "Bitstream Charter", Georgia, serif'
  ),
  cochin: regularPrototypeNavFont("Cochin", "Cochin, Georgia, serif"),
  athelas: regularPrototypeNavFont("Athelas", "Athelas, Georgia, serif"),
  "new-york": regularPrototypeNavFont(
    "New York",
    '"New York", Georgia, serif'
  ),
  georgia: regularPrototypeNavFont("Georgia", "Georgia, serif"),
  times: regularPrototypeNavFont("Times", '"Times New Roman", Times, serif'),
  "american-typewriter": regularPrototypeNavFont(
    "American Typewriter",
    '"American Typewriter", Georgia, serif'
  ),
  copperplate: regularPrototypeNavFont(
    "Copperplate",
    'Copperplate, "Copperplate Gothic Light", Georgia, serif'
  ),
  optima: regularPrototypeNavFont("Optima", "Optima, sans-serif"),
  avenir: regularPrototypeNavFont("Avenir", "Avenir, sans-serif"),
  "avenir-next": regularPrototypeNavFont(
    "Avenir Next",
    '"Avenir Next", Avenir, sans-serif'
  ),
  "helvetica-neue": regularPrototypeNavFont(
    "Helvetica Neue",
    '"Helvetica Neue", Helvetica, Arial, sans-serif'
  ),
  "gill-sans": regularPrototypeNavFont(
    "Gill Sans",
    '"Gill Sans", "Gill Sans MT", Calibri, sans-serif'
  ),
  futura: regularPrototypeNavFont("Futura", "Futura, sans-serif"),
  "trebuchet-ms": regularPrototypeNavFont(
    "Trebuchet MS",
    '"Trebuchet MS", sans-serif'
  ),
  verdana: regularPrototypeNavFont("Verdana", "Verdana, sans-serif"),
  "lucida-grande": regularPrototypeNavFont(
    "Lucida Grande",
    '"Lucida Grande", "Lucida Sans Unicode", sans-serif'
  ),
  geneva: regularPrototypeNavFont("Geneva", "Geneva, sans-serif"),
  "century-gothic": regularPrototypeNavFont(
    "Century Gothic",
    '"Century Gothic", AppleGothic, sans-serif'
  ),
  "system-sans": regularPrototypeNavFont(
    "System Sans",
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ),
  "system-serif": regularPrototypeNavFont(
    "System Serif",
    'ui-serif, "New York", Georgia, serif'
  ),
  menlo: regularPrototypeNavFont(
    "Menlo",
    'Menlo, Monaco, Consolas, "Liberation Mono", monospace'
  ),
} as const;

export const prototypeNavTintOptions = {
  off: { label: "Tint off", value: "#f5f5f5" },
  warm: { label: "Warm tint", value: "#efe3d4" },
  cool: { label: "Cool tint", value: "#e8edf0" },
} as const;

export type PrototypeNavHeightPreset = keyof typeof prototypeNavHeightOptions;
export type PrototypeNavLogoSizePreset =
  keyof typeof prototypeNavLogoSizeOptions;
export type PrototypeNavPaddingPreset = keyof typeof prototypeNavPaddingOptions;
export type PrototypeNavPaddingXPreset =
  keyof typeof prototypeNavPaddingXOptions;
export type PrototypeNavLinkSpacingPreset =
  keyof typeof prototypeNavLinkSpacingOptions;
export type PrototypeNavLinkSizePreset =
  keyof typeof prototypeNavLinkSizeOptions;
export type PrototypeNavLinkFontPreset =
  keyof typeof prototypeNavLinkFontOptions;
export type PrototypeNavTintPreset = keyof typeof prototypeNavTintOptions;

export const DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET: PrototypeNavHeightPreset =
  "standard";
export const DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET: PrototypeNavLogoSizePreset =
  "standard";
export const DEFAULT_PROTOTYPE_NAV_PADDING_PRESET: PrototypeNavPaddingPreset =
  "standard";
export const DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET: PrototypeNavPaddingXPreset =
  "wide";
export const DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET: PrototypeNavLinkSpacingPreset =
  "open";
export const DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET: PrototypeNavLinkSizePreset =
  "standard";
export const DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET: PrototypeNavLinkFontPreset =
  "archivo-regular";
export const DEFAULT_PROTOTYPE_NAV_TINT_PRESET: PrototypeNavTintPreset = "off";

export type PrototypeMainNavControlPresets = {
  heightPreset: PrototypeNavHeightPreset;
  logoSizePreset: PrototypeNavLogoSizePreset;
  paddingPreset: PrototypeNavPaddingPreset;
  paddingXPreset: PrototypeNavPaddingXPreset;
  linkSpacingPreset: PrototypeNavLinkSpacingPreset;
  linkSizePreset: PrototypeNavLinkSizePreset;
  linkFontPreset: PrototypeNavLinkFontPreset;
  tintPreset: PrototypeNavTintPreset;
};

export type PrototypeMainNavCssValues = {
  height: string;
  logoHeight: string;
  logoWidth: string;
  mobileLogoHeight: string;
  mobileLogoWidth: string;
  paddingY: string;
  paddingX: string;
  linkGap: string;
  wideLinkGap: string;
  linkFontSize: string;
  wideLinkFontSize: string;
  linkFontFamily: string;
  linkFontWeight: string;
  linkFontStyle: string;
  linkLetterSpacing: string;
  background: string;
};

export const defaultPrototypeMainNavControlPresets: PrototypeMainNavControlPresets =
  {
    heightPreset: DEFAULT_PROTOTYPE_NAV_HEIGHT_PRESET,
    logoSizePreset: DEFAULT_PROTOTYPE_NAV_LOGO_SIZE_PRESET,
    paddingPreset: DEFAULT_PROTOTYPE_NAV_PADDING_PRESET,
    paddingXPreset: DEFAULT_PROTOTYPE_NAV_PADDING_X_PRESET,
    linkSpacingPreset: DEFAULT_PROTOTYPE_NAV_LINK_SPACING_PRESET,
    linkSizePreset: DEFAULT_PROTOTYPE_NAV_LINK_SIZE_PRESET,
    linkFontPreset: DEFAULT_PROTOTYPE_NAV_LINK_FONT_PRESET,
    tintPreset: DEFAULT_PROTOTYPE_NAV_TINT_PRESET,
  };

export const getPrototypeMainNavCssValues = (
  presets: PrototypeMainNavControlPresets = defaultPrototypeMainNavControlPresets
): PrototypeMainNavCssValues => {
  const logoSize = prototypeNavLogoSizeOptions[presets.logoSizePreset];
  const linkFont = prototypeNavLinkFontOptions[presets.linkFontPreset];
  const linkSpacingPresets = Object.keys(
    prototypeNavLinkSpacingOptions
  ) as PrototypeNavLinkSpacingPreset[];
  const linkSizePresets = Object.keys(
    prototypeNavLinkSizeOptions
  ) as PrototypeNavLinkSizePreset[];
  const linkSpacingIndex = linkSpacingPresets.indexOf(
    presets.linkSpacingPreset
  );
  const linkSizeIndex = linkSizePresets.indexOf(presets.linkSizePreset);
  const wideLinkSpacingPreset =
    linkSpacingPresets[
      Math.min(linkSpacingIndex + 1, linkSpacingPresets.length - 1)
    ];
  const wideLinkSizePreset =
    linkSizePresets[Math.min(linkSizeIndex + 1, linkSizePresets.length - 1)];

  return {
    height: prototypeNavHeightOptions[presets.heightPreset].value,
    logoHeight: logoSize.height,
    logoWidth: logoSize.width,
    mobileLogoHeight: logoSize.mobileHeight,
    mobileLogoWidth: logoSize.mobileWidth,
    paddingY: prototypeNavPaddingOptions[presets.paddingPreset].value,
    paddingX: prototypeNavPaddingXOptions[presets.paddingXPreset].value,
    linkGap: prototypeNavLinkSpacingOptions[presets.linkSpacingPreset].value,
    wideLinkGap: prototypeNavLinkSpacingOptions[wideLinkSpacingPreset].value,
    linkFontSize: prototypeNavLinkSizeOptions[presets.linkSizePreset].value,
    wideLinkFontSize: prototypeNavLinkSizeOptions[wideLinkSizePreset].value,
    linkFontFamily: linkFont.family,
    linkFontWeight: linkFont.weight,
    linkFontStyle: linkFont.style,
    linkLetterSpacing: linkFont.letterSpacing,
    background: prototypeNavTintOptions[presets.tintPreset].value,
  };
};
