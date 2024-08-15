"use server";

//! https://www.youtube.com/watch?v=md65iBX5Gxg

import { getServerSession } from "next-auth";

export default async function processGithubLogin() {
  const session = await getServerSession();
  return session?.user?.name || null;
}
