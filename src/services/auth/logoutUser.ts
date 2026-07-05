"use server"

import { redirect } from "next/navigation";
import { deleteCookie } from "./tokenHandler";


export const logoutUser = async () => {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    // লগআউট ট্র্যাকিংয়ের জন্য কোয়েরি প্যারামিটারসহ রিডাইরেক্ট করা হলো
    redirect("/?loggedOut=true");
}