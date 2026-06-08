import { AppointmentStatus } from "../../../generated/prisma";

// ─── Appointment Slot ───

export interface CreateAppointmentSlotInput {
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  isAvailable?: boolean;
}

export interface UpdateAppointmentSlotInput {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

// ─── Appointment ───

export interface CreateAppointmentInput {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message?: string;
  date: string; // ISO date string from client
  slotId: string;
}

export interface UpdateAppointmentInput {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  date?: string;
  slotId?: string;
}

export interface UpdateAppointmentStatusInput {
  status: AppointmentStatus;
  meetLink?: string;
  adminNote?: string;
}
