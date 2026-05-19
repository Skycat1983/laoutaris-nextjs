"use server";

import { UserModel } from "../data/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { FlattenMaps } from "mongoose";
import { createServerLogger } from "@/lib/observability/logger";

// Define a more comprehensive return type
export interface SessionUser {
  id: string;
  role: "user" | "admin";
  username?: string;
}

// Type for a lean Mongoose document
type LeanDocument = FlattenMaps<any> &
  Required<{ _id: unknown }> & { __v: number };

const logger = createServerLogger({
  operation: "session.test_header_user_lookup",
  surface: "session_helper",
});

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Development test user lookup error");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

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
        logger.error("session.test_header_user.lookup_failed", {
          statusCategory: "development_test_user_lookup_failed",
          testHeaderType: "user",
          error: getErrorForLog(error),
        });
      }
      return { id: testUserId, role: "user" }; // Default to user role if not found
    }

    const testAdminId = req.headers.get("X-Test-Admin-Id");
    if (testAdminId) {
      return { id: testAdminId, role: "admin" };
    }
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    return {
      id: session.user.id,
      role: (session.user.role as "user" | "admin") || "user",
      username: session.user.name ?? undefined,
    };
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
