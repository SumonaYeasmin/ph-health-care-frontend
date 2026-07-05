/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { UserInfo } from "@/types/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandler";

/**
 * কুকি থেকে এক্সেস টোকেন নিয়ে ডিকোড করে ইউজারের প্রোফাইল তথ্য প্রদান করে।
 * @returns {Promise<UserInfo | null>} ইউজারের তথ্য অথবা নাল (যদি টোকেন না থাকে বা অবৈধ হয়)
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
    try {
        // কুকি থেকে এক্সেস টোকেন রিড করা হচ্ছে
        const accessToken = await getCookie("accessToken");

        if (!accessToken) {
            return null;
        }

        // সিক্রেট কি দিয়ে টোকেনটি ভেরিফাই করা হচ্ছে
        const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;

        if (!verifiedToken) {
            return null;
        }

        // ডিকোড করা টোকেন থেকে UserInfo অবজেক্ট তৈরি
        const userInfo: UserInfo = {
            name: verifiedToken.name || "Unknown User",
            email: verifiedToken.email,
            role: verifiedToken.role,
        };

        return userInfo;
    } catch (error: any) {
        // টোকেন অবৈধ বা এক্সপায়ার্ড হলে এরর হ্যান্ডেল করা
        console.error("Error in getUserInfo:", error.message || error);
        return null;
    }
}
