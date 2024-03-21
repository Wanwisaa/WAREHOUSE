import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = cookies(request).get("token");

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const decodedToken = await jwtVerify(token.value, secretKey, { algorithms: ["HS256"] });

    const role = decodedToken.payload.role;
    const expirationTimeInSeconds = decodedToken.payload.exp;

    // Check if the token has expired
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    if (expirationTimeInSeconds && expirationTimeInSeconds < currentTimestampInSeconds) {
      // Token has expired, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check role for admin access
    if (request.nextUrl.pathname.startsWith('/dashboard') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    // Handle JWT verification errors
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ["/", "/home/:path*", "/admin/:path*","/dashboard/:path*","/warehouse"]
};
