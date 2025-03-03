import { auth } from "@/server/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;

  // Se supone que auth() te da acceso a la sesión, así que asegúrate de obtenerla correctamente
  const session = await auth();
  const isLoggedIn = !!session;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Si es una ruta de autenticación API, no necesitas hacer nada
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Si es una ruta de autenticación y el usuario está logueado, redirígelo al inicio
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Si el usuario no está logueado y no es una ruta pública, redirígelo al login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Si ninguna de las condiciones se cumple, continúa con la siguiente respuesta
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
