import type { CSSProperties } from "react";

export const prototypeSectionFrameClassName =
  "mx-auto w-full max-w-[var(--prototype-home-frame-max,1920px)] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export const prototypeSectionEyebrowClassName =
  "prototype-home-accent-text font-archivo text-sm uppercase tracking-[0.14em]";

export const prototypeSectionMutedEyebrowClassName =
  "font-archivo text-sm uppercase tracking-[0.14em] opacity-70";

export const prototypeHomeTypographyCss = `
  .prototype-home-shell {
    --prototype-home-primary-bg: #f5f5f5;
    --prototype-home-primary-accent-color: #262626;
    --prototype-home-alt-accent-color: #5b4a3b;
  }

  .prototype-home-primary-bg {
    --prototype-home-section-accent-color: var(--prototype-home-primary-accent-color);
    --prototype-home-accent-muted: color-mix(in srgb, var(--prototype-home-section-accent-color) 34%, transparent);
    --prototype-home-accent-soft: color-mix(in srgb, var(--prototype-home-section-accent-color) 72%, transparent);
    background-color: var(--prototype-home-primary-bg);
  }

  .prototype-home-alt-bg {
    --prototype-home-section-accent-color: var(--prototype-home-alt-accent-color);
    --prototype-home-accent-muted: color-mix(in srgb, var(--prototype-home-section-accent-color) 34%, transparent);
    --prototype-home-accent-soft: color-mix(in srgb, var(--prototype-home-section-accent-color) 72%, transparent);
    background-color: var(--prototype-home-alt-bg);
  }

  .prototype-home-accent-text {
    color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-link {
    border-color: var(--prototype-home-section-accent-color);
    color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-link:hover {
    color: #262626;
  }

  .prototype-home-accent-border {
    border-color: var(--prototype-home-section-accent-color);
  }

  .prototype-home-accent-divider-border {
    border-color: var(--prototype-home-accent-muted);
  }

  .prototype-home-accent-divider {
    background-color: var(--prototype-home-accent-soft);
  }

  .prototype-home-shell .prototype-home-section-heading {
    font-size: calc(var(--prototype-heading-base) * var(--prototype-home-heading-scale, 1));
  }

  @media (min-width: 640px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-sm, var(--prototype-heading-base)) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 768px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1024px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base)))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1280px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-xl, var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base))))) * var(--prototype-home-heading-scale, 1));
    }
  }

  @media (min-width: 1536px) {
    .prototype-home-shell .prototype-home-section-heading {
      font-size: calc(var(--prototype-heading-2xl, var(--prototype-heading-xl, var(--prototype-heading-lg, var(--prototype-heading-md, var(--prototype-heading-sm, var(--prototype-heading-base)))))) * var(--prototype-home-heading-scale, 1));
    }
  }
`;

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
