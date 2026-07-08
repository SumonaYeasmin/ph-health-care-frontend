import { Column } from "@/src/components/shared/ManagementTable";
import { IDoctor } from "@/types/doctor.interface";
import Image from "next/image";

export const doctorsColumns: Column<IDoctor>[] = [
  {
    header: "Photo",
    accessor: (doctor) => {
      const initials = doctor.name
        ? doctor.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "DR";
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-muted bg-muted flex items-center justify-center font-semibold text-xs text-muted-foreground">
          {doctor.profilePhoto ? (
            <Image
              src={doctor.profilePhoto}
              alt={doctor.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Name",
    sortKey: "name",
    accessor: (doctor) => (
      <div>
        <div className="font-semibold">{doctor.name}</div>
        <div className="text-xs text-muted-foreground">{doctor.designation}</div>
      </div>
    ),
  },
  {
    header: "Email",
    sortKey: "email",
    accessor: (doctor) => doctor.email,
  },
  {
    header: "Contact",
    accessor: (doctor) => doctor.contactNumber,
  },
  {
    header: "Fee",
    sortKey: "appointmentFee",
    accessor: (doctor) => `$${doctor.appointmentFee}`,
  },
  {
    header: "Qualification",
    accessor: (doctor) => doctor.qualification,
  },
  {
    header: "Specialties",
    accessor: (doctor) => {
      if (doctor.doctorSpecialties && doctor.doctorSpecialties.length > 0) {
        return doctor.doctorSpecialties
          .map((ds) => ds.specialties?.title)
          .filter(Boolean)
          .join(", ");
      }
      return "N/A";
    },
  },
];
