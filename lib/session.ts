import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AppRole = "ADMIN" | "USER" | "GUEST";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getRole(): Promise<AppRole> {
  const s = await getSession();
  if (!s) return "GUEST";
  return (s.user as { role?: string }).role === "ADMIN" ? "ADMIN" : "USER";
}

// Defense in depth: proxy.ts blocks first, server code re-checks.
export async function requireUser() {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}

export async function requireAdmin() {
  const s = await requireUser();
  if ((s.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");
  return s;
}
