export interface BlogAvailability {
  [year: number]: Record<number, number>;
}

export type BlogSection = "latest" | "oldest" | "featured" | "popular";
