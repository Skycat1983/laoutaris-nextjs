import { Languages } from "@/hooks/useLanguage";

export type TranslationValue = {
  [key in Languages]: string;
};

// Simple flat structure where each key maps to translations
export type TranslationsMap = {
  [key: string]: TranslationValue;
};

export type TranslationKey = string;
