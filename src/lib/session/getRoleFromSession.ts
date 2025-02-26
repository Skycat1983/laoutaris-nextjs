"use server";

import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

type UserRole = "admin" | "user" | null;

export const getRoleFromSession = async (
  req: NextRequest
): Promise<UserRole> => {
  const token = await getToken({ req });
  return (token?.role as UserRole) || (token ? "user" : null);
};
