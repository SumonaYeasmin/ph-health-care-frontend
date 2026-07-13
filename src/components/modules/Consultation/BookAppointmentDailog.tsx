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
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { IDoctor } from "@/types/doctor.interface";
import { IDoctorSchedule } from "@/types/schedule.interface";
import { createAppointment } from "@/src/services/patient/appointment.services";
import { format } from "date-fns";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BookAppointmentDialogProps {
  doctor: IDoctor & { doctorSchedules?: IDoctorSchedule[] };
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentDialog({
  doctor,
  isOpen,
  onClose,
}: BookAppointmentDialogProps) {
  const router = useRouter();
  const doctorSchedules = doctor.doctorSchedules || [];
  const [selectedSchedule, setSelectedSchedule] =
    useState<IDoctorSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setSelectedSchedule(null);
    onClose();
  };

  const handleConfirmBooking = async () => {
    if (!doctor.id || !selectedSchedule) {
      toast.error("Please select a slot first");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createAppointment({
        doctorId: doctor.id,
        scheduleId: selectedSchedule.scheduleId
      });
      if (res.success) {
        toast.success("Appointment booked successfully!");
        handleCloseModal();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const groupSchedulesByDate = () => {
    const grouped: Record<string, IDoctorSchedule[]> = {};

    doctorSchedules.forEach((schedule: IDoctorSchedule) => {
      if (!schedule.schedule?.startDateTime) return;

      const startDate = new Date(schedule.schedule.startDateTime)
        .toISOString()
        .split("T")[0];

      if (startDate) {
        if (!grouped[startDate]) {
          grouped[startDate] = [];
        }
        grouped[startDate].push(schedule);
      }
    });

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  const groupedSchedules = groupSchedulesByDate();

  // Check if we have schedules but no schedule data (API issue)
  const hasSchedulesWithoutData =
    doctorSchedules.length > 0 && groupedSchedules.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <>
          <DialogHeader>
            <DialogTitle>Book Appointment with Dr. {doctor.name}</DialogTitle>
            <DialogDescription>
              Select an available time slot for your consultation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Doctor Info */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{doctor.designation}</p>
                <p className="text-sm text-muted-foreground">
                  Consultation Fee: ${doctor.appointmentFee}
                </p>
              </div>
            </div>

            {/* Schedules */}
            {hasSchedulesWithoutData ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Schedule data not available
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The doctor has {doctorSchedules.length} schedule
                  {doctorSchedules.length !== 1 ? "s" : ""}, but detailed
                  information is not loaded.
                </p>
              </div>
            ) : groupedSchedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No available slots at the moment
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please check back later
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {groupedSchedules.map(([date, dateSchedules]) => (
                    <div key={date}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">
                          {format(new Date(date), "EEEE, MMMM d, yyyy")}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {dateSchedules.map((schedule: IDoctorSchedule) => {
                          const startTime = schedule.schedule?.startDateTime
                            ? new Date(schedule.schedule.startDateTime)
                            : null;

                          return (
                            <Button
                              key={schedule.scheduleId}
                              variant={
                                selectedSchedule?.scheduleId ===
                                  schedule.scheduleId
                                  ? "default"
                                  : "outline"
                              }
                              className="justify-start h-auto py-2"
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                {startTime
                                  ? format(startTime, "h:mm a")
                                  : "N/A"}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} disabled={!selectedSchedule || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}