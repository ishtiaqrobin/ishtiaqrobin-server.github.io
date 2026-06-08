import express, { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { AppointmentValidation } from "./appointment.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── Appointment Slot Routes ───

// Get all slots (public — frontend needs this to show the booking form)
router.get("/slots", AppointmentController.getAppointmentSlots);

// Get available slots only (public)
router.get("/slots/available", AppointmentController.getAvailableSlots);

// Create a slot (admin only)
router.post(
  "/slots",
  auth(UserRole.ADMIN),
  validateRequest(AppointmentValidation.createAppointmentSlotZodSchema),
  AppointmentController.createAppointmentSlot,
);

// Update a slot (admin only)
router.put(
  "/slots/:slotId",
  auth(UserRole.ADMIN),
  validateRequest(AppointmentValidation.updateAppointmentSlotZodSchema),
  AppointmentController.updateAppointmentSlot,
);

// Delete a slot (admin only)
router.delete(
  "/slots/:slotId",
  auth(UserRole.ADMIN),
  AppointmentController.deleteAppointmentSlot,
);

// ─── Appointment Routes ───

// Book an appointment (public)
router.post(
  "/",
  validateRequest(AppointmentValidation.createAppointmentZodSchema),
  AppointmentController.createAppointment,
);

// Get all appointments (admin only)
router.get("/", auth(UserRole.ADMIN), AppointmentController.getAppointments);

// Get a single appointment by ID (admin only)
router.get(
  "/:appointmentId",
  auth(UserRole.ADMIN),
  AppointmentController.getAppointmentById,
);

// Update appointment details (admin only)
router.put(
  "/:appointmentId",
  auth(UserRole.ADMIN),
  validateRequest(AppointmentValidation.updateAppointmentZodSchema),
  AppointmentController.updateAppointment,
);

// Update appointment status — confirm / cancel / complete (admin only)
router.patch(
  "/:appointmentId/status",
  auth(UserRole.ADMIN),
  validateRequest(AppointmentValidation.updateAppointmentStatusZodSchema),
  AppointmentController.updateAppointmentStatus,
);

// Delete an appointment (admin only)
router.delete(
  "/:appointmentId",
  auth(UserRole.ADMIN),
  AppointmentController.deleteAppointment,
);

export const AppointmentRouter: Router = router;
