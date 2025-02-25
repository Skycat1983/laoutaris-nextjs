"use server";

import { getToken } from "next-auth/jwt";
import { UserModel } from "../data/models";
import { FlattenMaps } from "mongoose";
import { NextRequest } from "next/server";

// Define return types
export interface AuthUser {
  id: string;
  role: "user" | "admin";
  username?: string;
}

// Type for a lean Mongoose document
type LeanDocument = FlattenMaps<any> &
  Required<{ _id: unknown }> & { __v: number };

// Helper function to ensure we're working with a single document
function ensureSingleDocument(
  doc: LeanDocument | LeanDocument[] | null
): LeanDocument | null {
  if (!doc) return null;
  return Array.isArray(doc) ? (doc.length > 0 ? doc[0] : null) : doc;
}

/**
 * Get authenticated user from either JWT token or test headers
 * Works in both middleware and API routes
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  // Check for test headers first (development only)
  if (process.env.NODE_ENV === "development") {
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
        return { id: testUserId, role: "user" }; // Default if user exists but data is incomplete
      } catch (error) {
        console.error("Error fetching test user:", error);
      }
    }

    const testAdminId = req.headers.get("X-Test-Admin-Id");
    if (testAdminId) {
      console.log("Using test admin ID:", testAdminId);
      return { id: testAdminId, role: "admin" };
    }
  }

  // If no test headers or not in development, try to get the token
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token?.sub) {
      return {
        id: token.sub,
        role: (token.role as "user" | "admin") || "user",
        username: token.name as string,
      };
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }

  return null;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
  const user = await getAuthUser(req);
  return user?.role === "admin";
}
