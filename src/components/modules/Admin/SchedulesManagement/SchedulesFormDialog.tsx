"use client";

import InputFieldError from "@/src/components/shared/inputFieldError";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Field, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { createSchedulesAction } from "@/src/services/admin/scheduleManagement";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface ISchedulesFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SchedulesFormDialog = ({
  open,
  onClose,
  onSuccess,
}: ISchedulesFormDialogProps) => {
  const [state, formAction, pending] = useActionState(createSchedulesAction, null as any);

  useEffect(() => {
    if (state && state?.success) {
      toast.success("Schedules generated successfully!");
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Failed to create schedules");
    }
  }, [state, onSuccess, onClose]);

  // Set today's date as default for startDate
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Master Schedules</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                min={today}
                required
              />
              <InputFieldError field="startDate" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                min={today}
                required
              />
              <InputFieldError field="endDate" state={state} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                required
              />
              <InputFieldError field="startTime" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="endTime">End Time</FieldLabel>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                required
              />
              <InputFieldError field="endTime" state={state} />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulesFormDialog;
