import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");

  if (!isAdminPage || isLoginPage) {
    return NextResponse.next();
  }

  const adminAuth = request.cookies.get("admin_auth")?.value;

  if (adminAuth === "ok") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};