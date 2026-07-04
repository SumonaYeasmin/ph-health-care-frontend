"use client";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";

// সার্চ ফিল্টার কম্পোনেন্টের প্রপ্স
interface SearchFilterProps {
  placeholder?: string; // ইনপুটের প্লেসহোল্ডার টেক্সট (ডিফল্ট: Search...)
  paramName?: string; // ইউআরএল-এ যে কোয়েরি প্যারামিটার সেভ হবে (ডিফল্ট: searchTerm)
}

const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  // ইনপুটের টাইপিং ভ্যালু ট্র্যাক করার জন্য স্টেট
  const [value, setValue] = useState(searchParams.get(paramName) || "");
  
  // ডিবউন্স ভ্যালু (৫০০ মিলি-সেকেন্ড পর পর এপিআই রিকোয়েস্ট ট্রিগার করবে)
  const debouncedValue = useDebounce(value, 2000
    
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const initialValue = searchParams.get(paramName) || "";

    // ইনপুট ভ্যালু যদি আগের মতোই থাকে, তবে কাজ করার দরকার নেই
    if (debouncedValue === initialValue) {
      return;
    }

    if (debouncedValue) {
      params.set(paramName, debouncedValue); // ইউআরএল প্যারামিটার সেট হচ্ছে: ?searchTerm=debouncedValue
      params.set("page", "1"); // নতুন সার্চ শুরু হলে পেজ নম্বর ১ এ রিসেট করবে
    } else {
      params.delete(paramName); // সার্চ ফাকা করলে প্যারামিটার মুছে দেবে
      params.delete("page"); // পেজ নম্বর রিমুভ করে দেবে
    }

    startTransition(() => {
      // ইউআরএল কোয়েরি স্ট্রিং আপডেট করা হচ্ছে
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, router, searchParams]);

  return (
    <div className="relative">
      {/* সার্চ আইকন */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      {/* সার্চ ইনপুট ফিল্ড */}
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
};

export default SearchFilter;
