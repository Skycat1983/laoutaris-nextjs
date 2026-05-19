import { Languages } from "@/hooks/useLanguage";
import { translations } from "../translations";
import { TranslationKey } from "../translations/types";

export const getTranslation = (
  key: TranslationKey,
  language: Languages
): string => {
  const translation = translations[key];

  if (!translation) {
    return key;
  }

  if (!translation[language]) {
    return key;
  }

  return translation[language];
};

export const validateTranslationKey = (key: TranslationKey): boolean => {
  return !!translations[key];
};
