/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/src/lib/serverFetch";
import { zodValidator } from "@/src/lib/zodValidator";
import { IDoctor } from "@/types/doctor.interface";
import { createDoctorZodSchema, updateDoctorZodSchema } from "@/src/zod/doctors.validation";

export async function createDoctor(_prevState: any, formData: FormData) {
    try {
        const payload: IDoctor = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            contactNumber: formData.get("contactNumber") as string,
            address: formData.get("address") as string,
            registrationNumber: formData.get("registrationNumber") as string,
            experience: Number(formData.get("experience") as string),
            gender: formData.get("gender") as "MALE" | "FEMALE",
            appointmentFee: Number(formData.get("appointmentFee") as string),
            qualification: formData.get("qualification") as string,
            currentWorkingPlace: formData.get("currentWorkingPlace") as string,
            designation: formData.get("designation") as string,
            password: formData.get("password") as string,
        }
        
        const validation = zodValidator(payload, createDoctorZodSchema);
        if (validation.success === false) {
            return {
                ...validation,
                data: payload,
            };
        }

        const validatedPayload = validation.data;

        if (!validatedPayload) {
            throw new Error("Invalid payload");
        }

        const specialtiesStr = formData.get("specialties") as string;
        const specialties = specialtiesStr ? JSON.parse(specialtiesStr) : [];
        const specialtiesPayload = specialties.map((id: string) => ({
            specialitiesId: id,
        }));

        const newPayload = {
            password: validatedPayload.password,
            doctor: {
                name: validatedPayload.name,
                email: validatedPayload.email,
                contactNumber: validatedPayload.contactNumber,
                address: validatedPayload.address,
                registrationNumber: validatedPayload.registrationNumber,
                experience: validatedPayload.experience,
                gender: validatedPayload.gender,
                appointmentFee: validatedPayload.appointmentFee,
                qualification: validatedPayload.qualification,
                currentWorkingPlace: validatedPayload.currentWorkingPlace,
                designation: validatedPayload.designation,
            },
            specialties: specialtiesPayload,
        }
        const newFormData = new FormData()
        newFormData.append("data", JSON.stringify(newPayload))

        if (formData.get("file")) {
            newFormData.append("file", formData.get("file") as Blob)
        }

        const response = await serverFetch.post("/user/create-doctor", {
            body: newFormData,
        })

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
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function getDoctors(queryString?: string) {
    try {
        const response = await serverFetch.get(`/doctor${queryString ? `?${queryString}` : ""}`);
        
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

export async function getDoctorById(id: string) {
    try {
        const response = await serverFetch.get(`/doctor/${id}`)
        
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

export async function updateDoctor(id: string, _prevState: any, formData: FormData) {
    try {
        const payload: Partial<IDoctor> = {
            name: formData.get("name") as string,
            contactNumber: formData.get("contactNumber") as string,
            address: formData.get("address") as string,
            registrationNumber: formData.get("registrationNumber") as string,
            experience: Number(formData.get("experience") as string),
            gender: formData.get("gender") as "MALE" | "FEMALE",
            appointmentFee: Number(formData.get("appointmentFee") as string),
            qualification: formData.get("qualification") as string,
            currentWorkingPlace: formData.get("currentWorkingPlace") as string,
            designation: formData.get("designation") as string,
        }
        const validation = zodValidator(payload, updateDoctorZodSchema);
        if (validation.success === false) {
            return {
                ...validation,
                data: payload,
            };
        }

        const validatedPayload = validation.data;

        // Parse specialties and removeSpecialties
        const specialtiesStr = formData.get("specialties") as string;
        const removeSpecialtiesStr = formData.get("removeSpecialties") as string;
        const specialties = specialtiesStr ? JSON.parse(specialtiesStr) : [];
        const removeSpecialties = removeSpecialtiesStr ? JSON.parse(removeSpecialtiesStr) : [];

        const specialtiesPayload = [
            ...specialties.map((id: string) => ({
                specialitiesId: id,
            })),
            ...removeSpecialties.map((id: string) => ({
                specialitiesId: id,
                isDeleted: true,
            }))
        ];

        const updatedPayload = {
            ...validatedPayload,
            ...(specialtiesPayload.length > 0 ? { specialties: specialtiesPayload } : {}),
        };

        const response = await serverFetch.patch(`/doctor/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayload),
        })

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
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function softDeleteDoctor(id: string) {
    try {
        const response = await serverFetch.delete(`/doctor/soft/${id}`)
        
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

export async function deleteDoctor(id: string) {
    try {
        const response = await serverFetch.delete(`/doctor/${id}`)
        
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