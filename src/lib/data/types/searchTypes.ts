import { CollectionFrontend } from "./collectionTypes";
import { BlogEntryFrontend } from "./blogTypes";
import { ArticleFrontend } from "./articleTypes";

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
  "title" | "subtitle" | "summary" | "imageUrl" | "slug"
>;

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
  metadata: SearchResponseMetadata;
}
