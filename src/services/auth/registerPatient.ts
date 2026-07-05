/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";
import { loginUser } from "./loginUser";
import { zodValidator } from "@/src/lib/zodValidator";
import { registerPatientValidationZodSchema } from "@/src/zod/auth.validation";


// const registerPatientValidationZodSchema = z.object({
//     name: z.string().min(1, { message: "Name is required" }),
//     address: z.string().optional(),
//     email: z.email({ message: "Valid email is required" }),
//     password: z.string().min(6, {
//         error: "Password is required and must be at least 6 characters long",
//     }).max(100, {
//         error: "Password must be at most 100 characters long",
//     }),
//     confirmPassword: z.string().min(6, {
//         error: "Confirm Password is required and must be at least 6 characters long",
//     }),
// }).refine((data: any) => data.password === data.confirmPassword, {
//     error: "Passwords do not match",
//     path: ["confirmPassword"],
// });


export const registerPatient = async (_currentState: any, formData: any): Promise<any> => {
    try {
        console.log(formData.get("address"));
        const payload = {
            name: formData.get('name'),
            address: formData.get('address'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }

        const validatedFields = registerPatientValidationZodSchema.safeParse(payload);

        console.log(validatedFields, "val");

        // if (!validatedFields.success) {
        //     return {
        //         success: false,
        //         errors: validatedFields.error.issues.map(issue => {
        //             return {
        //                 field: issue.path[0],
        //                 message: issue.message,
        //             }
        //         }
        //         )
        //     }
        // }

        if(!zodValidator(payload,registerPatientValidationZodSchema).success){
            return zodValidator(payload,registerPatientValidationZodSchema);
        }

        const validatedPayload :any = zodValidator(payload,registerPatientValidationZodSchema).data;


        // const registerData = {
        //     password: formData.get('password'),
        //     patient: {
        //         name: formData.get('name'),
        //         address: formData.get('address'),
        //         email: formData.get('email'),
        //     }
        // }

        
        const registerData = {
            password: validatedPayload.password,
            patient: {
                name: validatedPayload.name,
                address:validatedPayload.address,
                email: validatedPayload.email,
            }
        }

       



        const newFormData = new FormData();

        newFormData.append("data", JSON.stringify(registerData));

        if(formData.get("file")){
            newFormData.append("file", formData.get("file")as Blob);
        }

        const res = await fetch("http://localhost:5000/api/v1/user/create-patient", {
            method: "POST",
            body: newFormData,
        }).then(res => res.json());

        console.log(res, "res");



        // ২. রেজিস্ট্রেশন // সফল হলে অটো লগইন
        if (res?.success) {
            const loginFormData = new FormData();
            loginFormData.append("email", formData.get("email"));
            loginFormData.append("password", formData.get("password"));
            // loginUser অ্যাকশনটি কল করা হলো, যা কুকি সেট করে সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করবে
            await loginUser(null, loginFormData);
        }

        return res;

    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Registration failed" };
    }
}