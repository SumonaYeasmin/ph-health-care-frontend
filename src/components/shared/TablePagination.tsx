"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

// প্রপ্স ইন্টারফেস
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
}

const TablePagination = ({ currentPage, totalPages }: TablePaginationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  // পেজ নেভিগেশন হ্যান্ডলার
  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // ১টির বেশি পেজ না থাকলে কিছু দেখাবে না
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous বাটন */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      {/* পেজ নাম্বার লিস্ট */}
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
          let pageNumber;

          // মোট পেজ ৫ বা তার কম হলে
          if (totalPages <= 5) {
            pageNumber = index + 1;
          // প্রথম ৩ পেজের মধ্যে থাকলে
          } else if (currentPage <= 3) {
            pageNumber = index + 1;
          // শেষের ৩ পেজের মধ্যে থাকলে
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + index;
          // মাঝখানের পেজগুলোর ক্ষেত্রে
          } else {
            pageNumber = currentPage - 2 + index;
          }
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => navigateToPage(pageNumber)}
              disabled={isPending}
              className="w-10"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Next বাটন */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>

      {/* পেজ কাউন্টার টেক্সট */}
      <span className="text-sm text-muted-foreground ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default TablePagination;
