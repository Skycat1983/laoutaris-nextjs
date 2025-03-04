import type { FrontendUser } from "./data/types/userTypes";

export const isFrontendUser = (
  author: string | FrontendUser
): author is FrontendUser => {
  return typeof author !== "string" && "_id" in author;
};
