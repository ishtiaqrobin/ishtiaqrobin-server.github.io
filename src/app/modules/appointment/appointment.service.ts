import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";
import {
  CreateAppointmentInput,
  CreateAppointmentSlotInput,
  UpdateAppointmentInput,
  UpdateAppointmentSlotInput,
  UpdateAppointmentStatusInput,
} from "./appointment.interface";

// ─── Appointment Slot Services ───

// Create a slot
const createAppointmentSlot = async (payload: CreateAppointmentSlotInput) => {
  const result = await prisma.appointmentSlot.create({
    data: payload,
  });

  return result;
};

// Get all slots
const getAppointmentSlots = async () => {
  const result = await prisma.appointmentSlot.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return result;
};

// Get available slots only
const getAvailableSlots = async () => {
  const result = await prisma.appointmentSlot.findMany({
    where: { isAvailable: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return result;
};

// Update a slot
const updateAppointmentSlot = async (
  slotId: string,
  payload: UpdateAppointmentSlotInput,
) => {
  const result = await prisma.appointmentSlot.update({
    where: { id: slotId },
    data: payload,
  });

  return result;
};

// Delete a slot
const deleteAppointmentSlot = async (slotId: string) => {
  const result = await prisma.appointmentSlot.delete({
    where: { id: slotId },
  });

  return result;
};

// ─── Appointment Services ───

// Book an appointment (public)
const createAppointment = async (payload: CreateAppointmentInput) => {
  const { date, ...rest } = payload;

  // Check that the slot exists and is available
  const slot = await prisma.appointmentSlot.findFirst({
    where: { id: rest.slotId, isAvailable: true },
  });

  if (!slot) {
    throw new Error("Selected slot is not available");
  }

  // Check for duplicate booking on the same slot + date
  const existing = await prisma.appointment.findFirst({
    where: {
      slotId: rest.slotId,
      date: new Date(date),
      status: { notIn: ["CANCELLED"] },
    },
  });

  if (existing) {
    throw new Error("This slot is already booked for the selected date");
  }

  const result = await prisma.appointment.create({
    data: {
      ...rest,
      date: new Date(date),
    },
    include: { slot: true },
  });

  return result;
};

// Get all appointments (admin)
const getAppointments = async () => {
  const result = await prisma.appointment.findMany({
    include: { slot: true },
    orderBy: { date: "asc" },
  });

  return result;
};

// Get a single appointment by ID
const getAppointmentById = async (appointmentId: string) => {
  const result = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { slot: true },
  });

  return result;
};

// Update appointment details (admin)
const updateAppointment = async (
  appointmentId: string,
  payload: UpdateAppointmentInput,
) => {
  const { date, ...rest } = payload;

  const result = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...rest,
      ...(date && { date: new Date(date) }),
    },
    include: { slot: true },
  });

  return result;
};

// Update appointment status (admin — confirm / cancel / complete)
const updateAppointmentStatus = async (
  appointmentId: string,
  payload: UpdateAppointmentStatusInput,
) => {
  const result = await prisma.appointment.update({
    where: { id: appointmentId },
    data: payload,
    include: { slot: true },
  });

  // Send confirmation email when status transitions to CONFIRMED
  if (payload.status === "CONFIRMED" && result.email) {
    try {
      const dateStr = new Date(result.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const timeStr = result.slot
        ? `${result.slot.startTime} - ${result.slot.endTime}`
        : "TBA";

      await sendEmail({
        to: result.email,
        subject: `Your appointment with Ishtiaq Robin is confirmed`,
        templateName: "appointment-confirmed",
        templateData: {
          name: result.name,
          topic: result.topic,
          date: dateStr,
          time: timeStr,
          meetLink: result.meetLink || "",
          adminNote: result.adminNote || "",
        },
      });
    } catch (err) {
      // Don't fail the status update if the email fails
      console.error("Failed to send appointment confirmation email:", err);
    }
  }

  return result;
};

// Delete an appointment (admin)
const deleteAppointment = async (appointmentId: string) => {
  const result = await prisma.appointment.delete({
    where: { id: appointmentId },
  });

  return result;
};

export const AppointmentService = {
  createAppointmentSlot,
  getAppointmentSlots,
  getAvailableSlots,
  updateAppointmentSlot,
  deleteAppointmentSlot,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
