/**
 * An array of routes that are accesible to the public.
 * Even users that are not logged in can access this ones.
 * @type {string[]}
 */
export const publicRoutes = ["/new-verification"];

/**
 * An array of routes that are accesible to the public.
 * These routes will redirect logged in users to settings.
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
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * This function takes the user role, and returns the default url for that role.
 * It is used for RBAC, and default redirecting
 * @param {string} role
 *
 */
export const getDefaultRedirect = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "DOCTOR":
      return "/doctor/home";
    case "PATIENT":
      return "/patient/home";
  }
};

/**
 * This function takes the current path, and returns the prefix, e.g. /admin, /patient or /doctor.
 * It is used for redirecting within a users portal.
 * @param {string} role
 *
 */
export const getRoutePrefix = (pathname: string) => {
  if (pathname.startsWith(adminRoutesPrefix)) {
    return adminRoutesPrefix;
  }
  if (pathname.startsWith(patientRoutesPrefix)) {
    return patientRoutesPrefix;
  }
  if (pathname.startsWith(doctorRoutesPrefix)) {
    return doctorRoutesPrefix;
  }
  return null; // Si la ruta no coincide con ningún prefijo
};

/**
 * The prefix for Admin only routes.
 * Routes that start with this prefix are used for Admin pages.
 * @type {string}
 */
export const adminRoutesPrefix = "/admin";

/**
 * The prefix for Patient only routes.
 * Routes that start with this prefix are used for Patient pages.
 * @type {string}
 */
export const patientRoutesPrefix = "/patient";

/**
 * The prefix for Doctor only routes.
 * Routes that start with this prefix are used for Doctor pages.
 * @type {string}
 */
export const doctorRoutesPrefix = "/doctor";
