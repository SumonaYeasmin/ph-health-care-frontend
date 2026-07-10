import { Column } from "@/src/components/shared/ManagementTable";
import { IDoctorSchedule } from "@/types/schedule.interface";
import { format } from "date-fns";
import { Badge } from "@/src/components/ui/badge";

export const myScheduleColumns: Column<IDoctorSchedule>[] = [
  {
    header: "Date",
    accessor: (docSchedule) => {
      const schedule = docSchedule.schedule;
      if (!schedule) return "N/A";
      return format(new Date(schedule.startDateTime), "EEEE, MMMM d, yyyy");
    },
  },
  {
    header: "Start Time",
    accessor: (docSchedule) => {
      const schedule = docSchedule.schedule;
      if (!schedule) return "N/A";
      return format(new Date(schedule.startDateTime), "h:mm a");
    },
  },
  {
    header: "End Time",
    accessor: (docSchedule) => {
      const schedule = docSchedule.schedule;
      if (!schedule) return "N/A";
      return format(new Date(schedule.endDateTime), "h:mm a");
    },
  },
  {
    header: "Status",
    accessor: (docSchedule) => (
      <Badge variant={docSchedule.isBooked ? "default" : "secondary"}>
        {docSchedule.isBooked ? "Booked" : "Available"}
      </Badge>
    ),
  },
];
