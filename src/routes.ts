/**
 * An array of routes that are accesible to the public.
 * Even users that are not logged in can access this ones.
 * @type {string[]}
 */
export const publicRoutes = ["/new-verification"];

/**
 * An array of routes that are accesible to the public.
 * These routes will redirect logged in users to settings
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/signup",
  "/auth-error",
  "/reset-password",
  "/new-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @param {string} email
 *
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
