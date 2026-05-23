import type { CSSProperties } from "react";

export const prototypeSectionFrameClassName =
  "mx-auto w-full max-w-[var(--prototype-home-frame-max,1920px)] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export const prototypeSectionEyebrowClassName =
  "prototype-home-accent-text font-archivo text-sm uppercase tracking-[0.14em]";

export const prototypeSectionMutedEyebrowClassName =
  "font-archivo text-sm uppercase tracking-[0.14em] opacity-70";

type PrototypeHeadingSizes = {
  base: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
};

type PrototypeHeadingStyle = CSSProperties & {
  "--prototype-heading-base": string;
  "--prototype-heading-sm"?: string;
  "--prototype-heading-md"?: string;
  "--prototype-heading-lg"?: string;
  "--prototype-heading-xl"?: string;
  "--prototype-heading-2xl"?: string;
};

export const prototypeHeadingStyle = ({
  base,
  sm,
  md,
  lg,
  xl,
  "2xl": twoXl,
}: PrototypeHeadingSizes): PrototypeHeadingStyle => ({
  "--prototype-heading-base": base,
  ...(sm ? { "--prototype-heading-sm": sm } : {}),
  ...(md ? { "--prototype-heading-md": md } : {}),
  ...(lg ? { "--prototype-heading-lg": lg } : {}),
  ...(xl ? { "--prototype-heading-xl": xl } : {}),
  ...(twoXl ? { "--prototype-heading-2xl": twoXl } : {}),
});
