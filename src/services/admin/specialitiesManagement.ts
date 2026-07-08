/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

import { serverFetch } from "@/src/lib/serverFetch";
import { zodValidator } from "@/src/lib/zodValidator";
import { createSpecialityZodSchema } from "@/src/zod/specialities.validation";

/**
 * ১. নতুন স্পেশালিটি (Speciality) তৈরি করার সার্ভার অ্যাকশন
 */
export async function createSpeciality(_prevState: any, formData: FormData) {
    try {
        const payload = {
            title: formData.get("title") as string,
        }
        
        if (zodValidator(payload, createSpecialityZodSchema).success === false) {
            return zodValidator(payload, createSpecialityZodSchema);
        }

        const validatedPayload = zodValidator(payload, createSpecialityZodSchema).data;

        const newFormData = new FormData()
        newFormData.append("data", JSON.stringify(validatedPayload))

        if (formData.get("file")) {
            newFormData.append("file", formData.get("file") as Blob)
        }

        const response = await serverFetch.post("/specialties", {
            body: newFormData,
        })

        // চেক করা হচ্ছে রেসপন্স সফল কি না
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || `Request failed with status ${response.status}`
            }
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return result;
        } else {
            const text = await response.text();
            return {
                success: false,
                message: text || "Invalid response format from server"
            }
        }
    } catch (error: any) {
        console.log(error);
        return { 
            success: false, 
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` 
        }
    }
}

/**
 * ২. ব্যাকএন্ড থেকে সব স্পেশালিটি ডাটা রিড করার ফাংশন
 */
export async function getSpecialities() {
    try {
        const response = await serverFetch.get("/specialties")
        
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || `Request failed with status ${response.status}`
            }
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return result;
        } else {
            const text = await response.text();
            return {
                success: false,
                message: text || "Invalid response format from server",
                data: []
            }
        }
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

/**
 * ৩. নির্দিষ্ট আইডি অনুযায়ী স্পেশালিটি ডিলিট করার ফাংশন
 */
export async function deleteSpeciality(id: string) {
    try {
        const response = await serverFetch.delete(`/specialties/${id}`)
        
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || `Request failed with status ${response.status}`
            }
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return result;
        } else {
            const text = await response.text();
            return {
                success: false,
                message: text || "Invalid response format from server"
            }
        }
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}