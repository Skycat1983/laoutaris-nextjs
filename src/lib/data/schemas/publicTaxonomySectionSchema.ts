import { z } from "zod";
import { ARTICLE_SECTION_OPTIONS, COLLECTION_SECTIONS } from "@/lib/constants";

const publicArticleSectionQuerySchema = z.object({
  section: z.enum(ARTICLE_SECTION_OPTIONS).nullable(),
});

const publicArticleNavigationParamsSchema = z.object({
  section: z.enum(ARTICLE_SECTION_OPTIONS),
});

const publicCollectionSectionQuerySchema = z.object({
  section: z.enum(COLLECTION_SECTIONS).nullable(),
});

export type PublicArticleSectionQueryFieldErrors = z.inferFlattenedErrors<
  typeof publicArticleSectionQuerySchema
>["fieldErrors"];

export type PublicArticleNavigationParamsFieldErrors = z.inferFlattenedErrors<
  typeof publicArticleNavigationParamsSchema
>["fieldErrors"];

export type PublicCollectionSectionQueryFieldErrors = z.inferFlattenedErrors<
  typeof publicCollectionSectionQuerySchema
>["fieldErrors"];

export const parsePublicArticleSectionQuery = (input: {
  section: string | null;
}) => publicArticleSectionQuerySchema.safeParse(input);

export const parsePublicArticleNavigationParams = (input: {
  section: string;
}) => publicArticleNavigationParamsSchema.safeParse(input);

export const parsePublicCollectionSectionQuery = (input: {
  section: string | null;
}) => publicCollectionSectionQuerySchema.safeParse(input);
