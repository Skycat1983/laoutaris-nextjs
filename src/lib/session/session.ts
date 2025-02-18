import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// TODO: delete?

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Sign and create a JWT
export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 min from now")
    .sign(key);
}

// Verify and decode a JWT
export async function verifyJWT(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Create a session and store it in a cookie
export async function createSession(user: { email: string; password: string }) {
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await signJWT({ user, expires });

  cookies().set("session", session, { expires, httpOnly: true });
}

// Destroy the session
export async function destroySession() {
  cookies().set("session", "", { expires: new Date(0) });
}

// Retrieve and verify the current session
export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await verifyJWT(session);
}

// Refresh the session expiration
export async function refreshSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await verifyJWT(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await signJWT(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
