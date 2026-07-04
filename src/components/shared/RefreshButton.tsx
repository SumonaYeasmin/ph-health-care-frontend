"use client";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

// রিফ্রেশ বাটনের প্রপ্স টাইপ
interface RefreshButtonProps {
  size?: "sm" | "default" | "lg"; // বাটনের সাইজ
  variant?: "default" | "outline" | "ghost"; // বাটনের ডিজাইন ভ্যারিয়েন্ট
  showLabel?: boolean; // বাটনের পাশে "Refresh" টেক্সট দেখাবে কিনা
}

const RefreshButton = ({
  size = "default",
  variant = "default",
  showLabel = true,
}: RefreshButtonProps) => {
  const router = useRouter();
  
  // Transition হুক (যা ব্যাকগ্রাউন্ডে এপিআই ডাটা রিফ্রেশ হওয়ার লোডিং ট্র‍্যাক করে)
  const [isPending, startTransition] = useTransition();

  // রিফ্রেশ বাটনের ক্লিক হ্যান্ডলার
  const handleRefresh = () => {
    startTransition(() => {
      // নেক্সট জেএস-এর রাউটার রিফ্রেশ কল করে ডাটা আপডেট করে
      router.refresh();
    });
  };
  
  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleRefresh}
      disabled={isPending}
    >
      {/* লোডিং অবস্থায় আইকনটি ঘুরবে (animate-spin) */}
      <RefreshCcw
        className={`h-4 w-4 ${isPending ? "animate-spin" : ""} ${
          showLabel ? "mr-2" : ""
        }`}
      />
      {showLabel && "Refresh"}
    </Button>
  );
};

export default RefreshButton;
