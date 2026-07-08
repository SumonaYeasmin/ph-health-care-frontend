import z from "zod";

export const createDoctorZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
  address: z.string().optional(),
  registrationNumber: z.string().min(1, { message: "Registration number is required" }),
  experience: z.number().nonnegative({ message: "Experience must be a positive number" }).optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender must be MALE or FEMALE" }),
  appointmentFee: z.number().positive({ message: "Appointment fee must be positive" }),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  currentWorkingPlace: z.string().min(1, { message: "Current working place is required" }),
  designation: z.string().min(1, { message: "Designation is required" }),
});

export const updateDoctorZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  contactNumber: z.string().min(1, { message: "Contact number is required" }).optional(),
  address: z.string().optional(),
  registrationNumber: z.string().min(1, { message: "Registration number is required" }).optional(),
  experience: z.number().nonnegative({ message: "Experience must be a positive number" }).optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender must be MALE or FEMALE" }).optional(),
  appointmentFee: z.number().positive({ message: "Appointment fee must be positive" }).optional(),
  qualification: z.string().min(1, { message: "Qualification is required" }).optional(),
  currentWorkingPlace: z.string().min(1, { message: "Current working place is required" }).optional(),
  designation: z.string().min(1, { message: "Designation is required" }).optional(),
});
