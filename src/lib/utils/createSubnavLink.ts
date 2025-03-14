import { SubnavLink } from "@/components/modules/navigation/subnav/Subnav";
import { buildUrl } from "./buildUrl";

type BaseLink = {
  label: string;
  slug: string;
};

export const createSubnavLink = (
  base: BaseLink,
  options: {
    stem: string;
    segments?: string[];
    forceDisabled?: boolean;
  }
): SubnavLink => {
  const { stem, segments = [], forceDisabled = false } = options;

  if (forceDisabled) {
    return {
      ...base,
      link_to: null,
      disabled: true,
    };
  }

  return {
    ...base,
    link_to: buildUrl([stem, base.slug, ...segments]),
    disabled: false,
  };
};
