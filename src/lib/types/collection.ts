import { IFrontendArtwork } from "./artwork";

export interface IFrontendCollection {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: IFrontendArtwork[];
  createdAt: Date;
  updatedAt: Date;
}
