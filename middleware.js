import { NextResponse } from "next/server";
import { verifyToken } from "./src/lib/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/login")) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // role protection
  if (path.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/petugas") && user.role !== "petugas") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/siswa") && user.role !== "siswa") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/petugas/:path*", "/siswa/:path*"], // FIXED
};
