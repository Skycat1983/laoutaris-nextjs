"use server";

import { UserModel } from "../data/models";
import { getServerSession } from "next-auth";
import { createUserFromSession } from "./createUserFromSession";
import { authOptions } from "@/lib/config/authOptions";
import { FlattenMaps } from "mongoose";

// Define a more comprehensive return type
export interface SessionUser {
  id: string;
  role: "user" | "admin";
  username?: string;
}

// Type for a lean Mongoose document
type LeanDocument = FlattenMaps<any> &
  Required<{ _id: unknown }> & { __v: number };

// Helper function to ensure we're working with a single document, not an array
function ensureSingleDocument(
  doc: LeanDocument | LeanDocument[] | null
): LeanDocument | null {
  if (!doc) return null;
  return Array.isArray(doc) ? (doc.length > 0 ? doc[0] : null) : doc;
}

export const getUserFromSession = async (
  req?: Request
): Promise<SessionUser | null> => {
  // For Postman testing in development environment
  if (process.env.NODE_ENV === "development" && req) {
    const testUserId = req.headers.get("X-Test-User-Id");
    if (testUserId) {
      console.log("Using test user ID:", testUserId);
      try {
        const rawUser = await UserModel.findById(testUserId)
          .select("role username")
          .lean()
          .exec();

        const user = ensureSingleDocument(rawUser);

        if (user) {
          return {
            id: testUserId,
            role: (user.role as "user" | "admin") || "user",
            username: user.username as string,
          };
        }
      } catch (error) {
        console.error("Error fetching test user:", error);
      }
      return { id: testUserId, role: "user" }; // Default to user role if not found
    }

    const testAdminId = req.headers.get("X-Test-Admin-Id");
    if (testAdminId) {
      console.log("Using test admin ID:", testAdminId);
      return { id: testAdminId, role: "admin" };
    }
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.name) {
    const username = session.user.name;
    const email = session.user.email || "";

    try {
      const rawUser = await UserModel.findOne({ username })
        .select("role")
        .lean()
        .exec();

      const user = ensureSingleDocument(rawUser);

      if (user) {
        return {
          id: user.id.toString(),
          role: (user.role as "user" | "admin") || "user",
          username,
        };
      } else {
        // Create new user if they don't exist
        if (email && username) {
          const userId = await createUserFromSession(username, email);
          return userId ? { id: userId, role: "user", username } : null;
        }
      }
    } catch (error) {
      console.error("Error fetching user from session:", error);
    }
  }

  return null;
};

// Keep the original function for backward compatibility
export const getUserIdFromSession = async (
  req?: Request
): Promise<string | null> => {
  const user = await getUserFromSession(req);
  return user ? user.id : null;
};

// Add a function to check if user is admin
export const isUserAdmin = async (req?: Request): Promise<boolean> => {
  const user = await getUserFromSession(req);
  return user?.role === "admin";
};
