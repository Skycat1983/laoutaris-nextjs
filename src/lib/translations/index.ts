import { TranslationsMap } from "./types";

import actions from "./categories/actions.json";
import artwork from "./categories/artwork.json";
import blog from "./categories/blog.json";
import common from "./categories/common.json";
import filters from "./categories/filters.json";
import navigation from "./categories/navigation.json";
import security from "./categories/security.json";

// helper funct  to flatten nested objects with dot notation
const flattenTranslations = (obj: any, prefix = ""): TranslationsMap => {
  return Object.keys(obj).reduce((acc: TranslationsMap, key: string) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (
      obj[key].en !== undefined &&
      obj[key].de !== undefined &&
      obj[key].fr !== undefined
    ) {
      acc[prefixedKey] = obj[key];
    } else {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    }

    return acc;
  }, {});
};

// Combine and flatten all translations
export const translations: TranslationsMap = {
  ...flattenTranslations(actions),
  ...flattenTranslations(artwork),
  ...flattenTranslations(blog),
  ...flattenTranslations(common),
  ...flattenTranslations(filters),
  ...flattenTranslations(navigation),
  ...flattenTranslations(security),
};

export * from "./types";
export * from "../utils/translationUtils";
