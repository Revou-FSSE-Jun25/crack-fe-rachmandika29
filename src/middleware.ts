import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  const isAuthenticated = Boolean(cookies.get("auth_token")?.value);

  const protectedRoutes = [
    "/(client)/dashboard",
    "/(admin)/admin",
  ];

  // If accessing a protected route without auth, redirect to sign-in
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // If already authenticated, avoid sign-in/sign-up pages
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    const redirectUrl = new URL("/dashboard", nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
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