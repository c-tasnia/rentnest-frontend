import { NextRequest, NextResponse } from "next/server";

const roleRoutes: Record<string, string> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const matchedPrefix = Object.keys(roleRoutes).find((prefix) => pathname.startsWith(prefix));

  if (matchedPrefix) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== roleRoutes[matchedPrefix]) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/tenant/:path*", "/dashboard/landlord/:path*", "/dashboard/admin/:path*"],
};
