"use client";

import { ISchedule } from "@/types/schedule.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import { deleteSchedule } from "@/src/services/admin/scheduleManagement";
import ManagementTable, { Column } from "@/src/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/src/components/shared/DeletConfirmationDialog";

interface ScheduleTableProps {
  schedules: ISchedule[];
}

const SchedulesTable = ({ schedules }: ScheduleTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingSchedule, setDeletingSchedule] = useState<ISchedule | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (schedule: ISchedule) => {
    setDeletingSchedule(schedule);
  };

  const confirmDelete = async () => {
    if (!deletingSchedule) return;

    setIsDeletingDialog(true);
    const result = await deleteSchedule(deletingSchedule.id);
    setIsDeletingDialog(false);
    if (result.success) {
      toast.success(result.message || "Schedule deleted successfully");
      setDeletingSchedule(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete schedule");
    }
  };

  const schedulesColumns: Column<ISchedule>[] = [
    {
      header: "Date",
      accessor: (schedule) => format(new Date(schedule.startDateTime), "EEEE, MMMM d, yyyy"),
    },
    {
      header: "Start Time",
      accessor: (schedule) => format(new Date(schedule.startDateTime), "h:mm a"),
    },
    {
      header: "End Time",
      accessor: (schedule) => format(new Date(schedule.endDateTime), "h:mm a"),
    },
  ];

  return (
    <>
      <Toaster position="top-center" richColors />
      <ManagementTable
        data={schedules}
        columns={schedulesColumns}
        onDelete={handleDelete}
        getRowKey={(schedule) => schedule.id}
        emptyMessage="No schedules found"
      />

      <DeleteConfirmationDialog
        open={!!deletingSchedule}
        onOpenChange={(open) => !open && setDeletingSchedule(null)}
        onConfirm={confirmDelete}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule slot? This action cannot be undone."
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default SchedulesTable;
