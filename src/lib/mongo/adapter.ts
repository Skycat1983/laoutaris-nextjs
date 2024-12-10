import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

export const CustomMongoDBAdapter = (client: Promise<MongoClient>) => {
  const baseAdapter = MongoDBAdapter(client);

  return {
    ...baseAdapter,
    async createUser(profile: any) {
      console.log("Custom createUser called:", profile);

      const customUser = {
        ...profile,
        username: profile.name,
        role: "user",
        watchlist: [],
        favourites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!baseAdapter.createUser) {
        throw new Error("createUser is not implemented by the base adapter");
      }

      const user = await baseAdapter.createUser(customUser);

      if (!user) {
        return null;
      }

      console.log("Custom user created:", user);
      return user;
    },
  };
};
