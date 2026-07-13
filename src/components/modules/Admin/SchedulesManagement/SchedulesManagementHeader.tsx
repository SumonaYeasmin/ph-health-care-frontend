"use client";

import ManagementPageHeader from "@/src/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import SchedulesFormDialog from "./SchedulesFormDialog";

const SchedulesManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      {isDialogOpen && (
        <SchedulesFormDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      <ManagementPageHeader
        title="Schedules Management"
        description="Create and generate master time slots for doctor bookings"
        action={{
          label: "Generate Schedules",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />
    </>
  );
};

export default SchedulesManagementHeader;
