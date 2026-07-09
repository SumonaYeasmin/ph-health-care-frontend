// define user roles in the application (ADMIN, DOCTOR, PATIENT)
export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

// type definition for route configuration
// exact: list of urls that must match exactly
// patterns: list of regular expressions to match dynamic routes (e.g. /doctor/*)
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

// authentication routes (accessible without logging in)
export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

// common protected routes accessible by all logged in users (e.g., profile or settings)
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password"],
    patterns: [], 
}


// routes protected for doctors only (starts with /doctor)
export const doctorProtectedRoutes: RouteConfig = {
    patterns: [/^\/doctor/], 
    exact: [], 
}

// routes protected for admins only (starts with /admin)
export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/], 
    exact: [], 
}

// routes protected for patients only (starts with /dashboard)
export const patientProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/], 
    exact: [], 
}

// checks if the user is trying to access an authentication route (login/register)
export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

// checks if a specific pathname matches the protected route configuration
export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    // first check exact route matching
    if (routes.exact.includes(pathname)) {
        return true;
    }
    // then check pattern matching (regex)
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

// determines the owner role of a route based on its path (ADMIN, DOCTOR, PATIENT, or COMMON)
export const getRouteOwner = (pathname: string): "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, doctorProtectedRoutes)) {
        return "DOCTOR";
    }
    if (isRouteMatches(pathname, patientProtectedRoutes)) {
        return "PATIENT";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null; // returns null if the route does not match any category or is public
}

// returns the default dashboard route based on user role
export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "DOCTOR") {
        return "/doctor/dashboard";
    }
    if (role === "PATIENT") {
        return "/dashboard";
    }
    return "/";
}

// validates if the redirect path after login matches the user's role
export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    // get the owner role of the redirect path
    const routeOwner = getRouteOwner(redirectPath);

    // allow redirect if the route is public (null) or a common protected route (COMMON)
    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    // allow redirect if the route owner matches the user role
    if (routeOwner === role) {
        return true;
    }

    // otherwise deny redirect (e.g. patients cannot access admin pages)
    return false;
}
