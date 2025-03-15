import { UserFrontend } from "./data/types";

export const isFrontendUser = (
  author: string | UserFrontend
): author is UserFrontend => {
  return typeof author !== "string" && "_id" in author;
};
