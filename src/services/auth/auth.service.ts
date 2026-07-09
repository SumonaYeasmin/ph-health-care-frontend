/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/src/lib/serverFetch";
import { revalidateTag } from "next/cache";

/**
 * Server Action to update the currently logged-in user's profile.
 * It extracts fields from the submitted FormData, structures the payload 
 * based on role specific requirements, and sends a PATCH request to the backend.
 * Finally, it triggers Next.js cache revalidation to update the profile UI immediately.
 * 
 * @param {FormData} formData - The submitted profile update form data
 * @returns {Promise<{success: boolean, message: string, data?: any}>} The result of the update operation
 */
export async function updateMyProfile(formData: FormData) {
    try {
        // Extract the selected file from the form data
        const file = formData.get("file") as File;
        
        // Extract common fields shared by all roles
        const name = formData.get("name") as string;
        const contactNumber = formData.get("contactNumber") as string;
        const address = formData.get("address") as string;
        
        // Build the base payload object
        const payload: any = {
            name,
            contactNumber,
            address
        };
        
        // Extract doctor-specific fields if they exist in the form data
        const designation = formData.get("designation");
        if (designation) payload.designation = designation;
        
        const qualification = formData.get("qualification");
        if (qualification) payload.qualification = qualification;
        
        const currentWorkingPlace = formData.get("currentWorkingPlace");
        if (currentWorkingPlace) payload.currentWorkingPlace = currentWorkingPlace;
        
        const experience = formData.get("experience");
        if (experience !== null && experience !== "") payload.experience = Number(experience);
        
        const appointmentFee = formData.get("appointmentFee");
        if (appointmentFee !== null && appointmentFee !== "") payload.appointmentFee = Number(appointmentFee);
        
        const gender = formData.get("gender");
        if (gender) payload.gender = gender;
        
        // Convert the JSON payload to string and append to new FormData
        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(payload));
        
        // Append the uploaded image file if present and valid
        if (file && file.size > 0) {
            newFormData.append("file", file);
        }
        
        // Send the PATCH request to the backend update endpoint
        const response = await serverFetch.patch("/user/update-my-profile", {
            body: newFormData
        });
        
        // Handle failed API requests
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || `Request failed with status ${response.status}`
            }
        }
        
        // Parse JSON response and revalidate cached pages/data
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            
            // Revalidate cached Next.js profile data to show updates instantly
            revalidateTag("profile");
            return result;
        } else {
            const text = await response.text();
            return {
                success: false,
                message: text || "Invalid response format from server"
            }
        }
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
}

/**
 * Server Function to fetch the currently logged-in user's profile details.
 * It sends a GET request to the backend /user/me endpoint and configures 
 * Next.js caching with the tag 'profile' for on-demand revalidation.
 * 
 * @returns {Promise<{success: boolean, message?: string, data?: any}>} The fetched profile data
 */
export async function getMyProfile() {
    try {
        // Send GET request with a tag for caching configuration
        const response = await serverFetch.get("/user/me", {
            next: {
                tags: ["profile"] // Enables cache clearing using revalidateTag("profile")
            }
        });
        
        // Handle failed profile retrieval requests
        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || `Request failed with status ${response.status}`
            }
        }
        
        // Parse and return the user profile details
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
        console.error("Error in getMyProfile:", error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
}
