import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { createAccountPrivacyAcknowledgement } from "@/lib/constants";

// extends the MongoDB adapter for Auth with custom user fields
export const CustomMongoDBAdapter = (client: Promise<MongoClient>) => {
  const baseAdapter = MongoDBAdapter(client);

  return {
    ...baseAdapter,
    async createUser(profile: any) {
      const customUser = {
        ...profile,
        username: profile.name,
        role: "user",
        watchlist: [],
        favourites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        accountPrivacyAcknowledgement: createAccountPrivacyAcknowledgement({
          acceptedBy: "oauth",
          provider: "oauth",
          sourceSurface: "oauth-provider-sign-in",
        }),
      };

      if (!baseAdapter.createUser) {
        throw new Error("createUser is not implemented by the base adapter");
      }

      const user = await baseAdapter.createUser(customUser);

      if (!user) {
        return null;
      }

      return user;
    },
  };
};
