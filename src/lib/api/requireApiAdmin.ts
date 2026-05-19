import type { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import dbConnect from "@/lib/db/mongodb";
import { UserModel } from "@/lib/data/models";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { apiAuthError } from "./apiAuthError";

type ApiAdminResult =
  | {
      ok: true;
      userId: string;
    }
  | {
      ok: false;
      response: NextResponse<ApiErrorResponse>;
    };

export async function requireApiAdmin(): Promise<ApiAdminResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      response: apiAuthError("Unauthorized", 401),
    };
  }

  if (session.user.role !== "admin") {
    return {
      ok: false,
      response: apiAuthError("Forbidden", 403),
    };
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(session.user.id);

    if (user?.role !== "admin") {
      return {
        ok: false,
        response: apiAuthError("Forbidden", 403),
      };
    }
  } catch {
    return {
      ok: false,
      response: apiAuthError("Unable to verify admin access", 500),
    };
  }

  return {
    ok: true,
    userId: session.user.id,
  };
}
