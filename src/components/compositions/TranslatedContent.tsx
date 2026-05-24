"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { getTranslation, TranslationKey } from "@/lib/translations";

type Content = string | TranslationKey;

export default function TranslatedContent({ content }: { content: Content }) {
  const { language } = useLanguage();
  return getTranslation(content, language);
}
