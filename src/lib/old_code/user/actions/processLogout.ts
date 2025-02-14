"use server";

import { destroySession } from "../session/session";

interface LogoutSuccessResult {
  type: "success";
  message: string;
}

interface AuthErrorResult {
  type: "auth";
  authError: string;
}

export type LogoutProcessResponse = LogoutSuccessResult | AuthErrorResult;

export async function processLogout(): Promise<LogoutProcessResponse> {
  try {
    // Destroy the user's session
    await destroySession();

    return {
      type: "success",
      message: "User logged out successfully.",
    };
  } catch (error: any) {
    console.error("Error during logout:", error);

    const errorMessage =
      error?.message || "An unexpected error occurred during logout.";

    return {
      type: "auth",
      authError: errorMessage,
    };
  }
}
