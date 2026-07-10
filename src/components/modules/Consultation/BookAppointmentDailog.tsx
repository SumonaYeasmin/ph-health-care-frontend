"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { IDoctor } from "@/types/doctor.interface";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookAppointmentDialogProps {
  doctor: IDoctor;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentDialog({
  doctor,
  isOpen,
  onClose,
}: BookAppointmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time slot");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call for booking an appointment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Appointment successfully booked with Dr. ${doctor.name}!`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextThreeDays = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Book Appointment
          </DialogTitle>
          <DialogDescription>
            Select a date and time slot for your consultation with Dr. {doctor.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleBook} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" /> Select Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {nextThreeDays.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`p-2.5 border rounded-lg text-sm text-center transition-all ${
                    selectedDate === date
                      ? "border-primary bg-primary/5 text-primary font-medium shadow-xs"
                      : "hover:bg-muted border-input"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> Select Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-2.5 border rounded-lg text-sm text-center transition-all ${
                    selectedTime === time
                      ? "border-primary bg-primary/5 text-primary font-medium shadow-xs"
                      : "hover:bg-muted border-input"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> Consultation Fee:
            </span>
            <span className="font-semibold">${doctor.appointmentFee}</span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
