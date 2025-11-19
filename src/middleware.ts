import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function parseAuthToken(token?: string | null): { authenticated: boolean; role: "user" | "admin" | null; email: string | null } {
  if (!token) return { authenticated: false, role: null, email: null };
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [role, email] = decoded.split(":");
    if (role === "admin" || role === "user") {
      return { authenticated: true, role, email: email ?? null };
    }
    return { authenticated: false, role: null, email: null };
  } catch {
    return { authenticated: false, role: null, email: null };
  }
}

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  const token = cookies.get("auth_token")?.value ?? null;
  const { authenticated, role } = parseAuthToken(token);

  // Gate admin routes except /admin/signin
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminSignIn = pathname === "/admin/signin";
  if (isAdminPath && !isAdminSignIn) {
    if (!authenticated || role !== "admin") {
      const adminSignInUrl = new URL("/admin/signin", nextUrl.origin);
      adminSignInUrl.searchParams.set("callbackUrl", nextUrl.href);
      return NextResponse.redirect(adminSignInUrl);
    }
  }

  // Redirect authenticated admins away from /admin/signin to /admin
  if (isAdminSignIn && authenticated && role === "admin") {
    const adminUrl = new URL("/admin", nextUrl.origin);
    return NextResponse.redirect(adminUrl);
  }

  // Gate client dashboard for unauthenticated users
  if (pathname.startsWith("/dashboard") && !authenticated) {
    const signInUrl = new URL("/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from /signin or /signup to /dashboard
  if (authenticated && (pathname === "/signin" || pathname === "/signup")) {
    const dashboardUrl = new URL("/dashboard", nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  // Continue the request
  return NextResponse.next();
}

// Only run middleware on relevant paths
export const config = {
  matcher: [
    // Exclude API routes and Next.js internal assets
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};