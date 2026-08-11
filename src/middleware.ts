import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  isMaintenanceMode,
  isMaintenanceStaticAsset,
  maintenanceResponseHeaders,
} from "@/lib/maintenance";

/**
 * Edge middleware (default runtime).
 * When MAINTENANCE_MODE=false this function is a cheap allow-list + admin JWT check.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ——— Maintenance lock (payment / ops) ———
  if (isMaintenanceMode()) {
    // Let the branded lock page, favicon, robots.txt, and static assets through.
    if (pathname === "/robots.txt" || pathname === "/favicon.ico" || isMaintenanceStaticAsset(pathname)) {
      return NextResponse.next();
    }

    // APIs (bookings, Razorpay, admin, search) — refuse rather than rewrite to HTML.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Service Unavailable",
          message: "This website is temporarily unavailable.",
        },
        { status: 503, headers: maintenanceResponseHeaders() },
      );
    }

    // Every HTML route (home, blog, rooms, admin, sitemap) → 503 maintenance page.
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    maintenanceUrl.search = "";

    const response = NextResponse.rewrite(maintenanceUrl, { status: 503 });
    const headers = maintenanceResponseHeaders();
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // ——— Normal operation ———
  // Hide the lock page when the site is online.
  if (pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Existing admin session gate (unchanged).
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("ksp_admin")?.value;
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercept app routes, APIs, and sitemap.
     * Skip Next.js internals, favicon, and file extensions (images/fonts).
     * robots.txt is excluded so App Router can serve a lock-aware robots file.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?)$).*)",
  ],
};
