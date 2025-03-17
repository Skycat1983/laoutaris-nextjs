import { CollectionFrontend, CollectionLean } from "./collectionTypes";
import { BlogEntryFrontend, BlogEntryLean } from "./blogTypes";
import { ArticleFrontend, ArticleLean } from "./articleTypes";

export type SearchQueriesType = {
  articles: Promise<(ArticleLean | null)[]>;
  blogs: Promise<(BlogEntryLean | null)[]>;
  collections: Promise<(CollectionLean | null)[]>;
};

// Content type literal
export type SearchableContentType = "articles" | "blogs" | "collections";

// Search params with proper typing
export interface SearchParams {
  q?: string;
  type?: SearchableContentType;
  page?: string;
  limit?: string;
}

// Base interface for common searchable fields
export interface SearchableFields {
  _id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  slug: string;
  imageUrl?: string;
}

// Union type for all searchable content
export type SearchableContent =
  | ArticleFrontend
  | BlogEntryFrontend
  | CollectionFrontend;

// Add a type for the URL
export type LinkTo = `/${string}`; // Template literal type to ensure it starts with /

// Base search result type
export type BaseSearchResultItem = Pick<
  SearchableContent,
  "title" | "subtitle" | "summary" | "text" | "imageUrl" | "slug"
>;

// Extended search result with link
export type SearchResultItem = BaseSearchResultItem & {
  linkTo: LinkTo;
};

// Type for the API response
export interface SearchResponse {
  articles?: SearchResultItem[];
  blogs?: SearchResultItem[];
  collections?: SearchResultItem[];
}
