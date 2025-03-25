import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { getTranslation, TranslationKey } from "@/lib/translations";

type Content = string | TranslationKey;

export default function TranslatedContent({ content }: { content: Content }) {
  const { language } = useGlobalFeatures();
  return getTranslation(content, language);
}
