import { FrontendArtwork, FrontendArtworkFull } from "./artworkTypes";

interface BaseFrontendCollection {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T;

export interface FrontendCollection extends BaseFrontendCollection {
  artworks: PopulatedField<FrontendArtwork>[];
}

export interface FrontendCollectionWithArtworks extends BaseFrontendCollection {
  artworks: FrontendArtwork[];
}

export interface FrontendCollectionFull {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: FrontendArtworkFull[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FrontendCollectionUnpopulated {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: string[];
  createdAt: Date;
  updatedAt: Date;
}

//! OLD TYPES BELOW:
//* TRYING WITH FULL USER TYPE
