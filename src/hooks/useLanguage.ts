import { useCallback, useState } from "react";

export type Languages = "en" | "de" | "fr";

export interface UseLanguageValues {
  language: Languages;
  changeLanguage: (language: Languages) => void;
}

export const useLanguage = (): UseLanguageValues => {
  const [language, setLanguage] = useState<Languages>("fr");

  const changeLanguage = useCallback((language: Languages) => {
    setLanguage(language);
  }, []);

  return { language, changeLanguage };
};
