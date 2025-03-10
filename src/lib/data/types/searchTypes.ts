import { Collection } from "./collectionTypes";
import { BlogEntry } from "./blogTypes";
import { Article } from "./articleTypes";

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
export type SearchableContent = Article | BlogEntry | Collection;

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
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
