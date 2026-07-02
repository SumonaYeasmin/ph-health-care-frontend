import { getCookie } from "@/src/services/auth/tokenHandler";

// ব্যাকএন্ড এপিআই-এর বেস ইউআরএল নির্ধারণ (এনভায়রনমেন্ট ফাইল থেকে অথবা লোকালহোস্ট ৫০০০ পোর্ট)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

/**
 * সার্ভার সাইড ফেচ করার মূল অভ্যন্তরীণ হেল্পার ফাংশন
 * @param endpoint এপিআই-এর নির্দিষ্ট রাউট (যেমন: /auth/login)
 * @param options ফেচ রিকোয়েস্টের অতিরিক্ত অপশনসমূহ
 */
const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    // অপশনস থেকে হেডার এবং বাকি কনফিগারেশনগুলো আলাদা করা হচ্ছে
    const { headers, ...restOptions } = options;

    // টেস্টিংয়ের জন্য রিকোয়েস্ট বডি কনসোলে প্রিন্ট করে দেখা হচ্ছে
    console.log({ body: options.body });

    // কুকি থেকে এক্সেস টোকেন রিড করা হচ্ছে
    const accessToken = await getCookie("accessToken");

    // ব্যাকএন্ড ইউআরএল এবং এন্ডপয়েন্ট জুড়ে দিয়ে রিকোয়েস্ট পাঠানো হচ্ছে
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
        headers: {
            ...headers,
            // ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
            // ...(accessToken ? { "Authorization": accessToken } : {}),
            Cookie: accessToken ? `accessToken=${accessToken}` : "",
        },
        ...restOptions,
    });

    return response;
};

// এপিআই রিকোয়েস্ট পাঠানোর জন্য এক্সপোর্ট করা অবজেক্ট (সহজ শর্টকাট মেথডসমূহ)
export const serverFetch = {
    // GET রিকোয়েস্ট পাঠানোর শর্টকাট
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "GET" }),

    // POST রিকোয়েস্ট পাঠানোর শর্টকাট
    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "POST" }),

    // PUT রিকোয়েস্ট পাঠানোর শর্টকাট
    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    // PATCH রিকোয়েস্ট পাঠানোর শর্টকাট
    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    // DELETE রিকোয়েস্ট পাঠানোর শর্টকাট
    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
