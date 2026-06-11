import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isOwnerRoute = pathname.startsWith("/owner");
  const isTenantRoute = pathname.startsWith("/tenant");

  // Unauthenticated user tries to access protected routes
  if ((isOwnerRoute || isTenantRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Wrong-role guard: owner can't visit /tenant and vice versa
  if (isOwnerRoute && role === "tenant") {
    return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
  }
  if (isTenantRoute && role === "owner") {
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/tenant/:path*"],
};
