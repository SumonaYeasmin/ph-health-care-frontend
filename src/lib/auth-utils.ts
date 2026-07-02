// অ্যাপ্লিকেশনে ব্যবহারকারী বা ইউজারের রোলসমূহ নির্ধারণ (ADMIN, DOCTOR, PATIENT)
export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

// রুট কনফিগারেশনের জন্য টাইপ ডেফিনিশন। 
// exact: হুবহু মিলতে হবে এমন ইউআরএল এর তালিকা।
// patterns: রেগুলার এক্সপ্রেশন (RegExp) প্যাটার্ন যা দিয়ে রুট মিলানো হবে (যেমন: /doctor/*)।
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

// অথেন্টিকেশন সম্পর্কিত রুটস (এই পেজগুলোতে ইউজার লগইন না করে যায়)
export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

// সবার জন্য কমন এবং সুরক্ষিত রুট (যেমন: প্রোফাইল বা সেটিংস পেজ)
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings"],
    patterns: [], 
}

// শুধুমাত্র ডাক্তারদের জন্য সুরক্ষিত রুটস (যা /doctor দিয়ে শুরু হয়)
export const doctorProtectedRoutes: RouteConfig = {
    patterns: [/^\/doctor/], 
    exact: [], 
}

// শুধুমাত্র এডমিনদের জন্য সুরক্ষিত রুটস (যা /admin দিয়ে শুরু হয়)
export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/], 
    exact: [], 
}

// শুধুমাত্র রোগীদের জন্য সুরক্ষিত রুটস (যা /dashboard দিয়ে শুরু হয়)
export const patientProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/], 
    exact: [], 
}

// ইউজার যে পেজে যাওয়ার চেষ্টা করছে সেটি অথেন্টিকেশন রুট (লগইন/রেজিস্ট্রেশন) কিনা তা চেক করে
export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

// একটি নির্দিষ্ট ইউআরএল (pathname) আমাদের সুরক্ষিত রুট কনফিগারেশনের সাথে ম্যাচ করে কিনা তা চেক করে
export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    // প্রথমে exact (হুবহু) রুটের সাথে ম্যাচিং চেক করে
    if (routes.exact.includes(pathname)) {
        return true;
    }
    // তারপর patterns (রেগুলার এক্সপ্রেশন) এর সাথে ম্যাচিং চেক করে
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

// ইউআরএল দেখে সেই রুটের মালিক কে (ADMIN, DOCTOR, PATIENT বা COMMON) তা নির্ধারণ করে
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
    return null; // রুটটি যদি পাবলিক বা কোনো ক্যাটাগরির সাথে না মিলে
}

// ইউজারের রোল অনুযায়ী ডিফল্ট ড্যাশবোর্ড রুট ঠিক করে
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

// লগইন করার পর কাঙ্ক্ষিত রিডাইরেক্ট রুটটি ওই ইউজারের রোল এর সাথে সামঞ্জস্যপূর্ণ কিনা তা ভ্যালিডেট করে
export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    // রিডাইরেক্ট পাথের মালিক কে তা বের করা হচ্ছে
    const routeOwner = getRouteOwner(redirectPath);

    // যদি রুটটি সবার জন্য উম্মুক্ত (null) বা কমন প্রোটেক্টেড (COMMON) হয়, তবে রিডাইরেক্ট করা যাবে
    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    // যদি রুটের মালিক আর ইউজারের রোল মিলে যায়, তবে রিডাইরেক্ট করা যাবে
    if (routeOwner === role) {
        return true;
    }

    // অন্যথায় রিডাইরেক্ট করা যাবে না (যেমন: রোগীকে এডমিন পেজে রিডাইরেক্ট করা যাবে না)
    return false;
}
