import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    const isOnboarding = pathname.startsWith("/onboarding");

    if (token && !token.onboardingCompleted && !isOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (token && token.onboardingCompleted && isOnboarding) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/roadmap/:path*",
    "/videos/:path*",
    "/vocabulary/:path*",
    "/speaking/:path*",
    "/progress/:path*",
    "/calendar/:path*",
    "/settings/:path*",
    "/search/:path*",
    "/onboarding/:path*",
  ],
};
