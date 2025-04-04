import { auth } from "@/server/auth";
import {
  apiAuthPrefix,
  adminRoutesPrefix,
  patientRoutesPrefix,
  doctorRoutesPrefix,
  authRoutes,
  publicRoutes,
  getDefaultRedirect,
} from "@/routes";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;
  const session = await auth();
  const isLoggedIn = !!session;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutesPrefix);
  const isPatientRoute = nextUrl.pathname.startsWith(patientRoutesPrefix);
  const isDoctorRoute = nextUrl.pathname.startsWith(doctorRoutesPrefix);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(getDefaultRedirect(session?.user.role as string)!, nextUrl),
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  //Role Based Access Control

  if (isAdminRoute && session?.user.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL(getDefaultRedirect(session?.user.role as string)!, nextUrl),
    );
  }

  if (isPatientRoute && session?.user.role !== "PATIENT") {
    return NextResponse.redirect(
      new URL(getDefaultRedirect(session?.user.role as string)!, nextUrl),
    );
  }

  if (isDoctorRoute && session?.user.role !== "DOCTOR") {
    return NextResponse.redirect(
      new URL(getDefaultRedirect(session?.user.role as string)!, nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
