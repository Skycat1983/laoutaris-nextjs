import type { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { apiAuthError } from "./apiAuthError";

type ApiUserResult =
  | {
      ok: true;
      userId: string;
    }
  | {
      ok: false;
      response: NextResponse<ApiErrorResponse>;
    };

export async function requireApiUser(): Promise<ApiUserResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      response: apiAuthError("Unauthorized", 401),
    };
  }

  return {
    ok: true,
    userId: session.user.id,
  };
}
