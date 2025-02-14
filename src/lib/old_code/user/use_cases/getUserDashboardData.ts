import { FrontendUserUnpopulated } from "@/lib/data/types/userTypes";
import { getUserIdFromSession } from "../session/getUserIdFromSession";
import { fetchUser } from "../data-fetching/fetchUser";

export const getUserDashboardData =
  async (): Promise<FrontendUserUnpopulated> => {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("User not found");
    }
    const identifierKey = "_id";
    const identifierValue = userId;
    const fields: string[] = [];

    const user = await fetchUser<FrontendUserUnpopulated>(
      identifierKey,
      identifierValue,
      fields
    );
    if (!user.success) {
      throw new Error("Failed to fetch user data");
    }
    return user.data;
  };
