import {
  FrontendArtwork,
  FrontendArtworkFull,
  FrontendArtworkUnpopulated,
} from "./artworkTypes";
import { z } from "zod";

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

//! OLD TYPES BELOW:
//* TRYING WITH FULL USER TYPE
// export interface FrontendCollectionFull extends BaseFrontendCollection {
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   artworks: FrontendArtworkFull[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface FrontendCollectionUnpopulated {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   artworks: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }
