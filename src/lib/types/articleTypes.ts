export interface IFrontendArticle {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: any;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
}
