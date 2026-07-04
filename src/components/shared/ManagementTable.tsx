"use client";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// কলাম কনফিগারেশনের জন্য টাইপ ইন্টারফেস
export interface Column<T> {
  header: string; // কলামের টাইটেল বা নাম (যেমন: Name, Email)
  accessor: keyof T | ((row: T) => React.ReactNode); // ডেটার ফিল্ডের নাম অথবা কাস্টম রেন্ডার ফাংশন
  className?: string; // কলামের ডিজাইনের জন্য কাস্টম CSS ক্লাস
  sortKey?: string; // এই কলামের ওপর সর্টিং সচল করার জন্য নির্দিষ্ট ডেটাবেজ ফিল্ড কী (ঐচ্ছিক)
}

// টেবিল কম্পোনেন্টের প্রপ্স ইন্টারফেস
interface ManagementTableProps<T> {
  data: T[]; // টেবিলের মেইন ডাটা লিস্ট
  columns: Column<T>[]; // কলামের কনফিগারেশন এর তালিকা
  onView?: (row: T) => void; // ভিউ (Eye) বাটনের ক্লিক হ্যান্ডলার
  onEdit?: (row: T) => void; // এডিট (Edit) বাটনের ক্লিক হ্যান্ডলার
  onDelete?: (row: T) => void; // ডিলিট (Trash) বাটনের ক্লিক হ্যান্ডলার
  getRowKey: (row: T) => string; // প্রতিটি রো বা সারির ইউনিক আইডি কী পাওয়ার ফাংশন
  emptyMessage?: string; // কোনো ডাটা না থাকলে দেখানোর জন্য মেসেজ
  isRefreshing?: boolean; // টেবিল রিফ্রেশ হওয়ার সময় লোডিং স্টেট শো করার জন্য
}

// const ManagementTable<T> = (props: ManagementTableProps<T>) => {
//   return <div>ManagementTable</div>;
// };

function ManagementTable<T>({
  data = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  getRowKey,
  emptyMessage = "No records found.",
  isRefreshing = false,
}: ManagementTableProps<T>) {
  // এডিট, ভিউ বা ডিলিট যেকোনো একটি অ্যাকশন অন থাকলে অ্যাকশন কলামটি রেন্ডার হবে
  const hasActions = onView || onEdit || onDelete;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // ইউআরএল থেকে বর্তমান সর্টিং ফিল্ড এবং সর্টিং অর্ডার ('asc'/'desc') উদ্ধার করার জন্য
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  // কলামের হেডার ক্লিক করলে সর্টিং হ্যান্ডেল করার ফাংশন
  const handleSort = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // একই কলামে পুনরায় ক্লিক করলে সর্ট অর্ডার টগল হবে (asc থেকে desc অথবা desc থেকে asc)
    if (currentSortBy === sortKey) {
      const newOrder = currentSortOrder === "asc" ? "desc" : "asc";
      params.set("sortOrder", newOrder);
    } else {
      // নতুন কলামে ক্লিক করলে বাই-ডিফল্ট descending সর্টিং হবে
      params.set("sortBy", sortKey);
      params.set("sortOrder", "desc");
    }

    params.set("page", "1"); // সর্টিং পরিবর্তনের পর প্রথম পেজে ফেরত পাঠানো হবে

    startTransition(() => {
      // ইউআরএল কোয়েরি স্ট্রিং আপডেট
      router.push(`?${params.toString()}`);
    });
  };

  // সর্টিং স্ট্যাটাস অনুযায়ী হেডারে দেখানোর জন্য সর্ট আইকন পাওয়ার হেল্পার ফাংশন
  const getSortIcon = (sortKey?: string) => {
    if (!sortKey) return null;

    // যদি এই কলামটি বর্তমানে সর্ট করা না থাকে, তবে অলটারনেটিভ আপ-ডাউন আইকন দেখাবে
    if (currentSortBy !== sortKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }

    // সর্টিং এসেন্ডিং হলে আপ-অ্যারো আর ডিসেন্ডিং হলে ডাউন-অ্যারো আইকন দেখাবে
    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  return (
    <>
      <div className="rounded-lg border relative">
        {/* Refreshing Overlay */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Refreshing...</p>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {columns?.map((column, colIndex) => (
                <TableHead key={colIndex} className={column.className}>
                  {column.sortKey ? (
                    <span
                      onClick={() => handleSort(column.sortKey!)}
                      className="flex items-center p-2 hover:text-foreground transition-colors font-medium cursor-pointer select-none"
                    >
                      {column.header}
                      {getSortIcon(column.sortKey)}
                    </span>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-[70px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data?.map((item) => (
                <TableRow key={getRowKey(item)}>
                  {columns.map((col, idx) => (
                    <TableCell key={idx} className={col.className}>
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : String(item[col.accessor])}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ManagementTable;