import { cookies } from "next/headers"; // <-- নতুন যুক্ত করা হয়েছে
import PublicFooter from "@/src/components/shared/PublicFooter";
import PublicNavbar from "@/src/components/shared/PublicNavbar";

const CommonLayout = async ({ children } : { children: React.ReactNode }) => {
    // <-- নতুন যুক্ত করা হয়েছে: কুকি চেক করে isLoggedIn ডিফাইন করা হয়েছে
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.has("accessToken");

    return (
        <>  
            {/* <-- নতুন যুক্ত করা হয়েছে: isLoggedIn পাস করা হয়েছে */}
            <PublicNavbar isLoggedIn={isLoggedIn}/>
            {children}
            <PublicFooter/>
        </>
    );
};

export default CommonLayout;