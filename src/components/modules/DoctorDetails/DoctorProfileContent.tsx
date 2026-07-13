"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { IDoctor } from "@/types/doctor.interface";
import BookAppointmentDialog from "@/src/components/modules/Consultation/BookAppointmentDailog";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Hospital,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { useState } from "react";

// Props interface matching the expected IDoctor structure
interface DoctorProfileContentProps {
  doctor: IDoctor;
}

const DoctorProfileContent = ({ doctor }: DoctorProfileContentProps) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  // Extracting first two initials of the doctor's name to use as a fallback if profilePhoto is absent
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* --- Doctor Header Card (Contains Profile Photo, Name, Designation, Specialties, Ratings & Fee) --- */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile image container utilizing ShadCN Avatar fallback mechanism */}
            <div className="flex justify-center md:justify-start">
              <Avatar className="h-32 w-32">
                {doctor.profilePhoto ? (
                  <AvatarImage
                    src={
                      typeof doctor.profilePhoto === "string"
                        ? doctor.profilePhoto
                        : undefined
                    }
                    alt={doctor.name}
                  />
                ) : (
                  <AvatarFallback className="text-3xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Doctor's basic info text */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-muted-foreground mt-1">
                  {doctor.designation}
                </p>
              </div>

              {/* Badges for Doctor Specialties */}
              {doctor.doctorSpecialties &&
                doctor.doctorSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {doctor.doctorSpecialties.map((specialty) => (
                      <Badge key={specialty.specialties?.id} variant="secondary">
                        {specialty.specialties?.title || "Specialty"}
                      </Badge>
                    ))}
                  </div>
                )}

              {/* Rating and Consultation Fee */}
              <div className="flex flex-wrap gap-4">
                {doctor.averageRating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {doctor.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-primary">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">
                    ${doctor.appointmentFee}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    per visit
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setShowScheduleModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* --- Card showing Doctor's Contact Info (Email, Phone, Address) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.contactNumber}</span>
            </div>
            {doctor.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <span>{doctor.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Card showing Doctor's Professional Details (Experience, Workplace, Registration Number) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Experience field */}
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">
                  {doctor.experience
                    ? `${doctor.experience} years`
                    : "Not specified"}
                </p>
              </div>
            </div>
            {/* Current Workplace field */}
            <div className="flex items-center gap-3">
              <Hospital className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Workplace
                </p>
                <p className="font-semibold">{doctor.currentWorkingPlace}</p>
              </div>
            </div>
            {/* Registration Number field */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Number
                </p>
                <p className="font-semibold">{doctor.registrationNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Card displaying Doctor's Qualifications and Educational background --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Qualification & Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{doctor.qualification}</p>
        </CardContent>
      </Card>

      <BookAppointmentDialog
        doctor={doctor}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
};

export default DoctorProfileContent;