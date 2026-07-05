/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

// প্রয়োজনীয় মডিউল এবং ফাংশন ইমপোর্ট করা হচ্ছে
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/src/lib/auth-utils";
import { serverFetch } from "@/src/lib/serverFetch";
import { zodValidator } from "@/src/lib/zodValidator";
import { loginValidationZodSchema } from "@/src/zod/auth.validation";
// Custom cookie parsing function
const parse = (cookieStr: string): Record<string, string> => {
    const parts = cookieStr.split(';');
    const obj: Record<string, string> = {};

    const firstPart = parts[0].trim();
    const equalSignIndex = firstPart.indexOf('=');
    if (equalSignIndex !== -1) {
        const key = firstPart.slice(0, equalSignIndex).trim();
        const val = firstPart.slice(equalSignIndex + 1).trim();
        obj[key] = val;
        obj.name = key;
        obj.value = val;
    }

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        const eqIndex = part.indexOf('=');
        if (eqIndex !== -1) {
            const key = part.slice(0, eqIndex).trim();
            const val = part.slice(eqIndex + 1).trim();
            obj[key] = val;
        } else {
            obj[part] = "true";
        }
    }
    return obj;
};

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

// // Zod Schema: ইনপুট ভ্যালিডেশনের জন্য ইমেইল ও পাসওয়ার্ড এর নিয়ম সেট করা
// const loginValidationZodSchema = z.object({
//     email: z.email({
//         message: "Email is required",
//     }),
//     password: z.string("Password is required").min(6, {
//         error: "Password is required and must be at least 6 characters long",
//     }).max(100, {
//         error: "Password must be at most 100 characters long",
//     }),
// });

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        // রিডাইরেক্ট পাথ ও কুকি অবজেক্টের প্রাথমিক ভ্যালু সেট করা
        const redirectTo = formData.get('redirect') || null;
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        // ফর্ম থেকে ইউজার ইনপুট (Email & Password) নেওয়া
        const payload = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        // // Zod ব্যবহার করে ডাটা ভ্যালিডেট করা
        // const validatedFields = loginValidationZodSchema.safeParse(payload);

        // // ভ্যালিডেশন ফেইল করলে ভুলগুলো রিটার্ন করা
        // if (!validatedFields.success) {
        //     return {
        //         success: false,
        //         errors: validatedFields.error.issues.map(issue => {
        //             return {
        //                 field: issue.path[0],
        //                 message: issue.message,
        //             }
        //         })
        //     }
        // }



             if (zodValidator(payload, loginValidationZodSchema).success === false) {
            return zodValidator(payload, loginValidationZodSchema);
        }

         const validatedPayload = zodValidator(payload, loginValidationZodSchema).data;


        // ব্যাকএন্ড এপিআই-তে লগইন রিকোয়েস্ট পাঠানো
        // const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        //     method: "POST",
        //     body: JSON.stringify(payload),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });

             const res = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validatedPayload),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await res.json();

        if (!result.success) {
            throw new Error(result.message || "Login failed");
        }

        // ব্যাকএন্ড রেসপন্স থেকে Set-Cookie হেডারগুলো সংগ্রহ করা
        const setCookieHeaders = res.headers.getSetCookie();

        // কুকি হেডার থাকলে সেগুলোকে 'cookie' লাইব্রেরি দিয়ে পার্স করে অবজেক্টে রূপান্তর করা
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);

                // কুকিগুলোর মধ্যে accessToken এবং refreshToken আলাদা করা
                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            })
        } else {
            throw new Error("No Set-Cookie header found");
        }

        // টোকেন না পাওয়া গেলে এরর থ্রো করা
        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        // Next.js-এর কুকি স্টোর অ্যাক্সেস করা
        const cookieStore = await cookies();

        // accessToken কুকি স্টোরে সেভ করা (শিক্ষকের দেওয়া অপশন অনুযায়ী)
        cookieStore.set("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
            path: accessTokenObject.Path || "/",
            sameSite: accessTokenObject['SameSite'] || "none",
        });

        // refreshToken কুকি স্টোরে সেভ করা (শিক্ষকের দেওয়া অপশন অনুযায়ী)
        cookieStore.set("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite'] || "none",
        });

        // JWT টোকেনটি ভেরিফাই করে ইউজারের ডাটা ডিকোড করা
        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_SECRET as string);

        if (typeof verifiedToken === "string") {
            throw new Error("Invalid token");
        }

        // ডিকোড করা টোকেন থেকে ইউজারের রোল (ADMIN, DOCTOR, PATIENT) বের করা
        const userRole: UserRole = verifiedToken.role;

        // যদি কোনো নির্দিষ্ট রিডাইরেক্ট ইউআরএল থাকে, তবে রোল ভ্যালিডেশন করে সেখানে রিডাইরেক্ট করা
        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(requestedPath);
            } else {
                redirect(getDefaultDashboardRoute(userRole)); 
            }
        } else {
            // যদি redirectTo না থাকে, তবে সরাসরি ডিফল্ট ড্যাশবোর্ডে রিডাইরেক্ট করা হবে
            redirect(getDefaultDashboardRoute(userRole));
        } 

    } catch (error: any) {
        // Next.js এর নিজস্ব রিডাইরেক্ট এররগুলোকে আবার থ্রো করা (যা Next.js রিডাইরেক্ট করার জন্য প্রয়োজনীয়)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Login Failed. You might have entered incorrect email or password."}` };
    }
}