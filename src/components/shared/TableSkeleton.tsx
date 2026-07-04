import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

// টেবিল স্কেলেটন কম্পোনেন্টের প্রপ্স টাইপ
interface TableSkeletonProps {
  columns: number; // কয়টি কলাম থাকবে
  rows?: number; // কয়টি রো বা লাইন দেখাবে
  showActions?: boolean; // অ্যাকশন বাটন কলামটি শো করবে কিনা
}

export function TableSkeleton({
  columns = 6,
  rows = 10,
  showActions = true,
}: TableSkeletonProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        {/* টেবিলের হেডার স্কেলেটন */}
        <TableHeader>
          <TableRow>
            {/* কলামগুলোর হেডার নেমের জন্য শিমার ইফেক্ট */}
            {[...Array(columns)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-full" />
              </TableHead>
            ))}
            {/* অ্যাকশন কলামের হেডার শিমার */}
            {showActions && (
              <TableHead className="w-[70px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        
        {/* টেবিলের বডি স্কেলেটন */}
        <TableBody>
          {/* রো-গুলোর সংখ্যা অনুযায়ী লুপ চলছে */}
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {/* প্রতিটা কলামের সেলে শিমার লাইন */}
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <div className="flex items-center gap-2">
                    {/* প্রথম কলামে গোল প্রোফাইল অবতার স্কেলেটন */}
                    {colIndex === 0 && (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    )}
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
              ))}
              {/* অ্যাকশন বাটনের জায়গায় গোল/চারকোনা শিমার */}
              {showActions && (
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
