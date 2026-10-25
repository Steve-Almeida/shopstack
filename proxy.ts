import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Exp 8: Next.js 16 proxy (formerly middleware) — role-based gate.
//   Guest : public pages only
//   User  : + /dashboard
//   Admin : + /admin, /api/admin
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });
  const role = !session
    ? "GUEST"
    : (session.user as { role?: string }).role === "ADMIN"
      ? "ADMIN"
      : "USER";

  const isApi = pathname.startsWith("/api/");
  const deny = (status: 401 | 403) => {
    if (isApi) {
      return NextResponse.json(
        { error: status === 401 ? "Unauthorized" : "Forbidden" },
        { status }
      );
    }
    if (status === 401) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  };

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (role === "GUEST") return deny(401);
    if (role !== "ADMIN") return deny(403);
  }
  if (pathname.startsWith("/dashboard")) {
    if (role === "GUEST") return deny(401);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"],
};
