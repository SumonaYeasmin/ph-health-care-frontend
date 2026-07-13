import { IDoctor } from "./doctor.interface";
import { IPatient } from "./patient.interface";
import { ISchedule } from "./schedule.interface";

export interface IAppointment {
    id: string;
    patientId: string;
    patient?: IPatient;
    doctorId: string;
    doctor?: IDoctor;
    scheduleId: string;
    schedule?: ISchedule;
    videoCallingId: string;
    status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PAID" | "UNPAID";
    createdAt: string;
    updatedAt: string;
}

export interface IAppointmentFormData {
    doctorId: string;
    scheduleId: string;
}
