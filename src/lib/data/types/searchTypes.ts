import type { CollectionFrontend } from "./collectionTypes";
import type { BlogEntryFrontend } from "./blogTypes";
import type { ArticleFrontend } from "./articleTypes";
import type { ArtworkFrontend } from "./artworkTypes";

// Content type literal
export type SearchableContentType =
  | "articles"
  | "blogs"
  | "collections"
  | "artworks";

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
  slug?: string;
  imageUrl?: string;
}

// Union type for all searchable content
export type SearchableContent =
  | ArticleFrontend
  | BlogEntryFrontend
  | CollectionFrontend
  | ArtworkFrontend;

// Add a type for the URL
export type LinkTo = `/${string}`; // Template literal type to ensure it starts with /

// Base search result type
export type BaseSearchResultItem = {
  title: string;
  subtitle?: string;
  summary?: string;
  imageUrl?: string;
  slug?: string;
};

// Extended search result with link
export type SearchResultItem = BaseSearchResultItem & {
  linkTo: LinkTo;
};

export type SearchResultTypeMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  hasPreviousPage: boolean;
};

export type SearchResponseMetadata = {
  page: number;
  limit: number;
  searchedTypes: SearchableContentType[];
  total: number;
  hasMore: boolean;
  types: Partial<Record<SearchableContentType, SearchResultTypeMetadata>>;
};

// Type for the API response
export interface SearchResponse {
  articles?: SearchResultItem[];
  blogs?: SearchResultItem[];
  collections?: SearchResultItem[];
  artworks?: SearchResultItem[];
  metadata: SearchResponseMetadata;
}
