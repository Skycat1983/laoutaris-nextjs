import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/config/authOptions";
import type { NextAuthOptions } from "next-auth";

export const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };
