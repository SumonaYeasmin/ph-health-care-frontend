"use client";
import { LucideIcon, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

// হেডার কম্পোনেন্টের প্রপ্স টাইপ
interface ManagementPageHeaderProps {
  title: string; // পেজের মেইন টাইটেল (যেমন: Admin Management)
  description?: string; // পেজের ছোট বর্ণনা (যেমন: Manage all administrators here)
  action?: {
    icon?: LucideIcon; // বাটনের কাস্টম আইকন (ডিফল্ট Plus আইকন)
    label: string; // বাটনের টেক্সট (যেমন: Create Admin)
    onClick: () => void; // বাটন ক্লিক করলে যে ফাংশন রান হবে
  };
  children?: React.ReactNode; // অন্যান্য কাস্টম কন্টেন্ট পাস করার জন্য
}

const ManagementPageHeader = ({
  title,
  description,
  action,
  children,
}: ManagementPageHeaderProps) => {
  // যদি কোনো কাস্টম আইকন না পাঠানো হয়, তবে ডিফল্ট হিসেবে Plus আইকন ব্যবহার হবে
  const Icon = action?.icon || Plus;
  
  return (
    <div className="flex items-center justify-between">
      {/* টাইটেল এবং ডেসক্রিপশন অংশ */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {/* অ্যাকশন বাটন */}
      {action && (
        <Button onClick={action.onClick}>
          <Icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
      
      {/* এক্সট্রা কন্টেন্ট */}
      {children}
    </div>
  );
};

export default ManagementPageHeader;
