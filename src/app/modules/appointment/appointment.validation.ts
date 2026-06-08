import { z } from "zod";
import { AppointmentStatus } from "../../../generated/prisma";

// ─── Appointment Slot ───

const createAppointmentSlotZodSchema = z.object({
  dayOfWeek: z
    .number("Day of week is required")
    .int()
    .min(0, "Day must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Day must be between 0 (Sunday) and 6 (Saturday)"),
  startTime: z
    .string("Start time is required")
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z
    .string("End time is required")
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  isAvailable: z.boolean().optional().default(true),
});

const updateAppointmentSlotZodSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format")
    .optional(),
  isAvailable: z.boolean().optional(),
});

// ─── Appointment ───

const createAppointmentZodSchema = z.object({
  name: z.string("Name is required"),
  email: z.string("Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  topic: z.string("Topic is required"),
  message: z.string().optional(),
  date: z.string("Date is required").datetime("Invalid date format"),
  slotId: z.string("Slot ID is required").uuid("Invalid slot ID"),
});

const updateAppointmentZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  topic: z.string().optional(),
  message: z.string().optional(),
  date: z.string().datetime("Invalid date format").optional(),
  slotId: z.string().uuid("Invalid slot ID").optional(),
});

const updateAppointmentStatusZodSchema = z.object({
  status: z
    .nativeEnum(AppointmentStatus)
    .describe(
      "Status is required and must be one of: PENDING, APPROVED, REJECTED, COMPLETED",
    ),
  meetLink: z.string().url("Invalid meet link").optional(),
  adminNote: z.string().optional(),
});

export const AppointmentValidation = {
  createAppointmentSlotZodSchema,
  updateAppointmentSlotZodSchema,
  createAppointmentZodSchema,
  updateAppointmentZodSchema,
  updateAppointmentStatusZodSchema,
};
