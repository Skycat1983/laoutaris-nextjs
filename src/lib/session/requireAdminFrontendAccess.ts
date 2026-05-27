import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { UserModel } from "@/lib/data/models/userModel";
import dbConnect from "@/lib/db/mongodb";
import { authProtectedRoutes } from "@/lib/routes/authProtectedRoutes";

export type AdminFrontendAccessResult =
  | {
      ok: true;
      userId: string;
    }
  | {
      ok: false;
      reason: "unauthenticated" | "forbidden" | "unverified";
    };

export async function getAdminFrontendAccess(): Promise<AdminFrontendAccessResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      reason: "unauthenticated",
    };
  }

  if (session.user.role !== "admin") {
    return {
      ok: false,
      reason: "forbidden",
    };
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(session.user.id);

    if (user?.role !== "admin") {
      return {
        ok: false,
        reason: "forbidden",
      };
    }
  } catch {
    return {
      ok: false,
      reason: "unverified",
    };
  }

  return {
    ok: true,
    userId: session.user.id,
  };
}

export async function requireAdminFrontendAccess(): Promise<void> {
  const access = await getAdminFrontendAccess();

  if (access.ok) {
    return;
  }

  if (access.reason === "unauthenticated") {
    redirect(authProtectedRoutes.signIn);
  }

  if (access.reason === "unverified") {
    throw new Error("Unable to verify admin access");
  }

  redirect(authProtectedRoutes.home);
}
