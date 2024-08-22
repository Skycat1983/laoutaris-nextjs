"use server";

// TODO: delete?
import { getServerSession } from "next-auth";

export async function getGithubSession() {
  return await getServerSession();
}

export async function getSessionController() {
  const session = await getGithubSession();
}
