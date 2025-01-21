import { FrontendArtworkFull } from "./artworkTypes";

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

export interface FrontendCollectionMinimal {
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
