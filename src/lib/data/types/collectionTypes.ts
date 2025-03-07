import { CollectionDB } from "../models";
import {
  ArtworkFrontend,
  ArtworkSanitized,
  FrontendArtwork,
  FrontendArtworkFull,
  FrontendArtworkUnpopulated,
} from "./artworkTypes";
import { z } from "zod";
import { ArtworkLean } from "./artworkTypes";
export type CollectionLean = Omit<CollectionDB, keyof Document> & {
  artworks: string[];
};

export type CollectionLeanPopulated = CollectionLean & {
  artworks: ArtworkLean[];
};

export type CollectionSanitized = CollectionLean;

export type CollectionSanitizedPopulated = Omit<
  CollectionLeanPopulated,
  "artworks"
> & {
  artworks: ArtworkSanitized[];
};

export type CollectionFrontend = CollectionSanitized;

export type CollectionFrontendPopulated = Omit<
  CollectionSanitizedPopulated,
  "artworks"
> & {
  artworks: ArtworkFrontend[];
};

interface BaseFrontendCollection {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project" | "collections";
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T | Partial<T>;

export interface FrontendCollection extends BaseFrontendCollection {
  artworks: PopulatedField<FrontendArtwork>[];
}

export interface FrontendCollectionWithArtworks extends BaseFrontendCollection {
  artworks: FrontendArtworkUnpopulated[];
}

export interface FrontendCollectionUnpopulated extends BaseFrontendCollection {
  artworks: string[];
}

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}
