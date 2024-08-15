export interface IFrontendBlogEntry {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  tags: string[];
}
