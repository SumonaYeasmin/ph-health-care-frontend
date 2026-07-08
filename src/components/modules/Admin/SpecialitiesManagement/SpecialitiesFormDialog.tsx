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
import { createSpeciality } from "@/src/services/admin/specialitiesManagement";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

// props interface for the dialog component
interface ISpecialitiesFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SpecialitiesFormDialog = ({
  open,
  onClose,
  onSuccess,
}: ISpecialitiesFormDialogProps) => {
  // server action handling with form state and pending status
  const [state, formAction, pending] = useActionState(createSpeciality, null as any);

  // handle success/error feedback based on response state
  useEffect(() => {
    if (state && state?.success) {
      toast.success(state.message);
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  return (
    // main popup modal dialog
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Specialty</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {/* Specialty title input */}
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" name="title" placeholder="Cardiology" required />
            <InputFieldError field="title" state={state} />
          </Field>

          {/* Specialty icon upload */}
          <Field>
            <FieldLabel htmlFor="file">Upload Icon</FieldLabel>
            <Input id="file" name="file" type="file" accept="image/*" required />
            <InputFieldError field="file" state={state} />
          </Field>

          {/* Modal action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Specialty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialitiesFormDialog;
