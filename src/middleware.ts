import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public static assets and system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/thumbnails") ||
    pathname === "/icon.svg" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;

  // 3. Login page logic
  if (pathname === "/login" || pathname === "/api/auth/login") {
    // If already logged in, redirect away from /login to dashboard
    if (user && pathname === "/login") {
      return NextResponse.redirect(new URL("/switchstorm", req.url));
    }
    return NextResponse.next();
  }

  // 4. Protected routes: If not authenticated, redirect to /login
  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/" && pathname !== "/switchstorm") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
