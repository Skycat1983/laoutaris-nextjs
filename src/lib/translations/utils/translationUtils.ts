import { Languages } from "@/hooks/useLanguage";
import { translations } from "..";
import { TranslationKey } from "../types";

export const getTranslation = (
  key: TranslationKey,
  language: Languages
): string => {
  const translation = translations[key];

  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  if (!translation[language]) {
    console.warn(`Translation not available in ${language} for key: ${key}`);
    return key;
  }

  return translation[language];
};

export const validateTranslationKey = (key: TranslationKey): boolean => {
  return !!translations[key];
};
