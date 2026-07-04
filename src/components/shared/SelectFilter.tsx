"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// সিলেক্ট ফিল্টার কম্পোনেন্টের প্রপ্স টাইপ
interface SelectFilterProps {
  paramName: string; // ইউআরএল-এর কুয়েরি প্যারামিটার নেম (যেমন: ?gender=)
  placeholder?: string; // সিলেক্ট বক্সের প্লেসহোল্ডার টেক্সট
  options: { label: string; value: string }[]; // ড্রপডাউন অপশনের তালিকা
}

const SelectFilter = ({
  paramName,
  placeholder,
  options,
}: SelectFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ইউআরএল থেকে বর্তমান সিলেক্টেড ভ্যালু রিড করে (ডিফল্ট: All)
  const currentValue = searchParams.get(paramName) || "All";

  // অপশন পরিবর্তন হওয়ার হ্যান্ডলার
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // যদি All সিলেক্ট করা হয় তবে প্যারামিটার রিমুভ করবে, অন্যথায় নতুন মান সেট করবে
    if (value === "All") {
      params.delete(paramName);
    } else if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    startTransition(() => {
      // ইউআরএল কোয়েরি স্ট্রিং আপডেট
      router.push(`?${params.toString()}`);
    });
  };
  
  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* ডিফল্ট অল অপশন */}
        <SelectItem value="All">All</SelectItem>
        {/* পাঠানো অপশনগুলো রেন্ডার হচ্ছে */}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;
