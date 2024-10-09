import { IFrontendArtwork } from "./artworkTypes";

export interface IFrontendCollectionBase {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: IFrontendArtwork[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFrontendCollectionPopulated extends IFrontendCollectionBase {
  artworks: IFrontendArtwork[];
}

export interface IFrontendCollectionUnpopulated
  extends IFrontendCollectionBase {
  artworks: string[];
}

export type IFrontendCollection =
  | IFrontendCollectionPopulated
  | IFrontendCollectionUnpopulated;
